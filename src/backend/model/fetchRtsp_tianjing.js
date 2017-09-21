//获取天津媒资系统的播放串
const url = require('url')
const fetch = require('node-fetch')

// const rtspUrl="rtsp://10.80.0.51:554/1171500255538238^^^?sessionId=363472005&urlEndTime=20170824T130139Z&sessionSign=08c4608555910ebefe8ca4b85d8fcb28&startTime=0&endTime=162&productId=product01&tryFlag=0&subId=-999999&resourceId=102423131&resourceName=我上幼儿园啦"
// console.log(rtspUrl.split('?')[0])
// console.log(url.parse(rtspUrl,true).query)
// let query = {
//   //变化
//   areaCode: '113',
//   userId: '8120010526723934',
//   userSign: '8120010526723934',


//
//   //不变
//   productId: 'product01',
//   tryFlag: '0',
//   startTime: '0',
//   resourceName: '我上幼儿园啦',
//   subId: '-999999',
//   sessionId: '363472005',
//   sessionSign: '08c4608555910ebefe8ca4b85d8fcb28',
//   urlEndTime: '20170824T130139Z',
//   endTime: '162',
//   resourceId: '102423131',
//   columnId: ''
// }

function params(data) {
  if (typeof data == 'object') {
    var s = "";
    for (var k in data) {
      s += k + "=" + data[k] + "&";
    }
    s = s.slice(0, -1);
    return s;
  }
}

const getRtspUrl = 'http://43.224.208.201:8090/playurl/getOnDemandUrl.do'
const productCode = '12359'

function fetchRtspUrl(video) {
  const paramsObj = {
    areaCode: '113',
    assetID: `TXJY${video.id}002`,
    providerID: 'TXJY',
    userCode: '8120010526723934',
    tryFlag: 0,//1 试看   0订购使用,
    goodsCode: productCode//已购买使用的商品编码 当 trayFlag=0或者未填写 必填
  }
  return fetch(`${getRtspUrl}?${params(paramsObj)}`)
    .then(res => res.json())
    .then(json => {
      if (json && json.returnCode == 0) {
        //添加一个播放串属性
        const rtspUrl = json.rtspUrl
        const query = url.parse(rtspUrl, true).query
        video.videoUrl = `${rtspUrl.split('?')[0]}?${params({
          productId: query.productId,
          sessionId: query.sessionId,
          sessionSign: query.sessionSign,
          urlEndTime: query.urlEndTime,
          startTime: query.startTime,
          endTime: query.endTime,
          tryFlag: query.tryFlag,
          subId: query.subId,
          resourceId: query.resourceId,
          resourceName: query.resourceName
        })}`
      } else {
        console.log(`${video.name} 获取rtsp播放串失败===> ${json ? json.errorMsg : ''}`)
      }
      return Promise.resolve()
    })
    .catch(e => {
      console.log(`${video.name} 获取rtsp播放串失败====>${e.message}`)
      return Promise.resolve()
    })

}

async function fetchRtsp(data) {
  for (let bundle of data) {
    console.log(`剧集 ${bundle.name} 开始==================================================`)
    let fetchArr = []
    for (let video of bundle.videos) {
      fetchArr.push(fetchRtspUrl(video))
    }
    await Promise.all(fetchArr)
    console.log(`剧集 ${bundle.name} 结束==================================================`)
    console.log('')
  }
  //filter data
  const filterData = []
  for (let [bIndex, bundle] of data.entries()) {
    for (let video of bundle.videos) {
      if (!video.videoUrl) {
        //bundle to filter
        filterData.push(bIndex)
        break
      }
    }
  }
  const usefulData = []
  const dataNames = []
  for (let [bIndex, bundle] of data.entries()) {
    if (!filterData.includes(bIndex)) {
      usefulData.push(bundle)
      dataNames.push(bundle.name)
    }
  }
  console.log('-------------------------------------------------------')
  console.log(`可以商用的媒资： ${dataNames}`)
  return usefulData
}

module.exports.fetchRtsp = fetchRtsp
