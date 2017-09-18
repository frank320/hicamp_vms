/**
 * Created by frank on 2017/4/25.
 */
const path = require('path')
const fs = require('fs')
const os = require('os')

const formidable = require('formidable')
const ffmpeg = require('fluent-ffmpeg')
const router = require('express').Router()

const config = require('../config')
const Album = require('../model/album')

//获取本机的ip地址
function getLocalIP() {
  var ifaces = os.networkInterfaces();
  var ip = 'localhost'
  for (var dev in ifaces) {
    //服务器ip
    if (dev.indexOf('eth0') != -1) {
      var tokens = dev.split(':');
      var dev2 = null;
      if (tokens.length == 2) {
        dev2 = 'eth1:' + tokens[1];
      } else if (tokens.length == 1) {
        dev2 = 'eth1';
      }
      if (null == ifaces[dev2]) {
        continue;
      }
      // 找到eth0和eth1分别的ip
      var ip = null, ip2 = null;
      ifaces[dev].forEach(function (details) {
        if (details.family == 'IPv4') {
          ip = details.address;
        }
      });
      ifaces[dev2].forEach(function (details) {
        if (details.family == 'IPv4') {
          ip2 = details.address;
        }
      });
      if (null == ip || null == ip2) {
        continue;
      }
      // 将记录添加到map中去
      if (ip.indexOf('10.') == 0 ||
        ip.indexOf('172.') == 0 ||
        ip.indexOf('192.') == 0) {
        return ip2;
      } else {
        return ip;
      }
    }
    //局域网ip
    if (dev == 'WLAN' || dev == '无线网络连接') {
      ifaces[dev].forEach(function (v) {
        if (v.family == 'IPv4') {
          ip = v.address
        }
      })
      return ip
    }
    //服务器局域网ip
    if (dev == '本地连接') {
      ifaces[dev].forEach(function (v) {
        if (v.family == 'IPv4') {
          ip = v.address
        }
      })
      return ip
    }
  }
  return ip
}


router.post('/add', function (req, res) {
  const form = new formidable.IncomingForm()

  // 指定本次文件上传的路径（默认保存到操作系统的临时目录了）
  form.uploadDir = config.resourcePath

  // 指定本次上传的文件保持扩展名（默认是false，没有扩展名）
  form.keepExtensions = true
  return form.parse(req, function (err, fields, files) {

    //判断资源路径的有效性
    const contentpath = fields.contentpath
    if (!contentpath || !fs.existsSync(contentpath)) {
      return res.json({
        code: 110,
        msg: '资源路径输入错误'
      })
    }
    const uploadData = {
      copyright: fields.copyright,
      //id: fields.contentcode,
      name: fields.name,
      summary: fields.summary,
      tags: JSON.parse(fields.tags),
      score: parseInt(fields.score),
      minAge: parseInt(fields.minAge),
      maxAge: parseInt(fields.maxAge),
      vip: parseInt(fields.vip),
      isAlbum: parseInt(fields.isAlbum),
      createdTime: Date.now(),
      updateTime: Date.now(),
      videos: []
    }

    //文件重命名 保持原有的命名
    let posterLargeName = ''
    let posterSmallName = ''
    //创建存放海报的文件夹
    const bundlePoster = path.join(config.resourcePath, 'bundlePoster')
    if (!fs.existsSync(bundlePoster)) {
      fs.mkdirSync(bundlePoster)
    }
    const bundleAvatar = path.join(config.resourcePath, 'bundleAvatar')
    if (!fs.existsSync(bundleAvatar)) {
      fs.mkdirSync(bundleAvatar)
    }

    try {
      if (files.posterLarge && files.posterLarge.name && files.posterLarge.type.startsWith('image')) {
        posterLargeName = files.posterLarge.name
        fs.renameSync(files.posterLarge.path, path.join(bundlePoster, posterLargeName))
      }
      if (files.posterSmall && files.posterSmall.name && files.posterSmall.type.startsWith('image')) {
        posterSmallName = files.posterSmall.name
        fs.renameSync(files.posterSmall.path, path.join(bundleAvatar, posterSmallName))
      }

    } catch (e) {
      return res.json({
        code: 500,
        msg: '文件保存出错'
      })
    }
    let localIp = getLocalIP()
    //生成图片路径
    function imgUrl(imgName) {
      return `/${imgName}`
    }

    uploadData.posterLarge = imgUrl(`bundlePoster/${posterLargeName}`)
    uploadData.posterSmall = imgUrl(`bundleAvatar/${posterSmallName}`)

    //设置剧集资源id
    uploadData.id = Math.ceil(Date.now() / 1000) + '000'

    //获取剧集资源信息
    function isDir(pathName) {//pathName为文件的绝对路径
      const stat = fs.lstatSync(pathName)
      return stat.isDirectory()
    }

    function isImg(fileName) {
      return /\.(jpg|png|gif|jepg)$/i.test(fileName)
    }

    //获取无后缀文件名
    function getNoneExtFileName(fileName) {
      return /(.+)\.\w+$/.exec(fileName)[1]
    }

    //格式化时间
    function formatTime(second) {
      second = parseInt(second)
      return [parseInt(second / 60 / 60), parseInt(second / 60) % 60, second % 60].join(":")
        .replace(/\b(\d)\b/g, "0$1");
    }

    const contentFiles = fs.readdirSync(contentpath)
    const bundleName = /\\([^\\]+)$/.exec(contentpath)[1] || fields.name

    let videos = []

    async function getVideosMetaData() {
      try {
        for (let videoDir of contentFiles) {
          await new Promise(resolve=> {
            const VideoDirPath = path.join(contentpath, videoDir)
            if (!isDir(VideoDirPath)) {
              return resolve('not dir')
            }
            //读取视频文件夹下的视频文件
            const videoFiles = fs.readdirSync(VideoDirPath)
            var videoFilePath = null
            var videoName = null
            if (videoFiles.length === 1) {
              //只有视频
              videoFilePath = path.join(VideoDirPath, videoFiles[0])
              videoName = getNoneExtFileName(videoFiles[0])
            }
            if (videoFiles.length === 2) {
              //若有海报
              const video = isImg(videoFiles[0]) ? videoFiles[1] : videoFiles[0]
              videoFilePath = path.join(VideoDirPath, video)
              videoName = getNoneExtFileName(video)
            }
            if (!videoFilePath) {
              console.log(bundleName + videoDir + '视频文件不存在')
              return resolve('not exsit')
            }
            //读取视频元信息
            ffmpeg.ffprobe(videoFilePath, function (err, metadata) {
              if (err) {
                console.log(videoName + '获取视频元信息失败')
                return resolve('fail')
              } else {
                const size = parseInt(metadata.format.size / 1024)//转化为kb计算
                videos.push({
                  id: parseInt(uploadData.id) + parseInt(videoDir) + '',
                  name: videoName,
                  duration: formatTime(metadata.format.duration),
                  size: size,
                  filePath: `/${bundleName}/${videoDir}/${videoName}.ts`,
                  poster: `/singlePoster/${bundleName}/${videoDir}_${videoName}.jpg`
                })
                return resolve('success')
              }
            })
          })
        }

      } catch (e) {
        //over look error
      }
      //排序
      videos.sort(function (a, b) {
        return (a.id - b.id)
      })
      uploadData.videos = videos
      //读取完毕 存入数据库
      const album = new Album(uploadData)
      return album
        .save()
        .then(()=> {
          res.json({
            code: 200,
            msg: '存入成功'
          })
        }).catch(e=> {
          res.json({
            code: 500,
            msg: e
          })
        })
    }

    getVideosMetaData()

  })
})
module.exports = router