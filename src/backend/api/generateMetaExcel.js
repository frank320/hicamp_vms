/**
 * Created by frank on 2017/8/29.
 */
const router = require('express').Router()
const fs = require("fs")
const path = require('path')
const ejsExcel = require("ejsexcel")

const config = require('../config')
const Album = require('../model/album')

router.post('/generateMetaExcel', (req, res) => {
  const checkList = JSON.parse(req.body.checkList)
  return Album
    .find({
      id: {$in: checkList}
    })
    .then(data => {
        //标清剧集
        //木灵宝贝之重回帆智谷 木奇灵之绿影战灵 进击的机甲-圣戒飞陀 洛克王国大冒险1 洛克王国大冒险2-恩佐日记
        // 童子传奇 童子传奇之大闹招财岛 童子传奇之招财岛总动员 蓝猫典典环游记 咪咪找妈妈 太阳城的故事 星史传说
        const filterData = [
          '1499078259000',
          '1499078340000',
          '1499078402000',
          '1499078644000',
          '1498040663000',
          '1498040723000',
          '1498040777000',
          '1498040842000',
          '1498040902000',
          '1498040961000',
          '1498037662000',
          '1498037715000'
        ]
        const tenImport = [
          '1498040237000',
          '1498040663000',
          '1498040723000',
          '1498040777000',
          '1499078259000',
          '1499078340000',
          '1499078402000',
          '1499078644000',
          '1498039671000',
          '1498040023000',
          '1498040082000',
          '1498040124000',
          '1498040169000'
        ]
        //处理data
        for (let bundle of data) {
          if (filterData.includes(bundle.id)) {
            for (let video of bundle.videos) {
              video.isSD = 1
            }
          }
          if (tenImport.includes(bundle.id)) {
            bundle.videos = bundle.videos.slice(0, 10)
          }
        }

        // let videos = [...data[0].videos]
        // data = [
        //   Object.assign(Object.assign({}, data[0]), {
        //     videos: videos.slice(0, 30)
        //   }),
        //   Object.assign(Object.assign({}, data[0]), {
        //     videos: videos.slice(30, 54)
        //   }),
        //   Object.assign(Object.assign({}, data[0]), {
        //     videos: videos.slice(54, 78)
        //   }),
        //   Object.assign(Object.assign({}, data[0]), {
        //     videos: videos.slice(78, 102)
        //   }),
        //   Object.assign(Object.assign({}, data[0]), {
        //     videos: videos.slice(102)
        //   }),
        // ]

        //获得Excel模板的buffer对象
        try {
          var exlBuf = fs.readFileSync(path.join(__dirname, '../template/metaExcelTJ_template.xlsx'))
        } catch (e) {
          return res.json({
            code: 500,
            msg: e
          })
        }

        //用数据源(对象)data渲染Excel模板
        return ejsExcel.renderExcelCb(exlBuf, data, function (err, exlBuf2) {
          if (err) {
            return res.json({
              code: 500,
              msg: err
            })
          }
          var newExcelName = "metaExcel.xlsx"
          try {
            fs.writeFileSync(config.resourcePath + newExcelName, exlBuf2)
          } catch (e) {
            return res.json({
              code: 500,
              msg: e
            })
          }
          return res.json({
            code: 200,
            excelPath: config.prefix + config.staicRoute + '/' + newExcelName
          })
        })
      }
    )
    .catch((e) => {
      return res.json({
        code: 500,
        msg: e
      })
    })

})

module.exports = router