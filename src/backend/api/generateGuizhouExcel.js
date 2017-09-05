/**
 * Created by frank on 2017/5/16.
 */
const router = require('express').Router()
const fs = require("fs")
const path = require('path')
const ejsExcel = require("ejsexcel")

const config = require('../config')
const Album = require('../model/album')

router.post('/generateGuizhouExcel', (req, res) => {
  const checkList = JSON.parse(req.body.checkList || JSON.stringify([]))
  return Album
    .find({
      id: {$in: checkList}
    })
    .then(data => {
      //读取贵州的媒资ID元数据
      const gzJson = JSON.parse(fs.readFileSync(path.join(config.resourcePath, 'guizhouAssetsId', 'guizhouAssetsId_20170906.json')))
      //关联贵州媒资ID
      for (let bundle of data) {
        for (let item of gzJson.selectableItemList) {
          try {
            const vTitle = /(.+)第(\d+)集$/.exec(item.titleFull)
            if (bundle.name == vTitle[1]) {
              bundle.videos[vTitle[2] - 1].assetId = item.assetId
            }
          } catch (e) {
            //overlook err
          }
        }
      }
      //检测处理后的data数据
      for (let [bIndex, bundle] of data.entries()) {
        for (let [index, video] of bundle.videos.entries()) {
          if (!video.assetId) {
            console.log(`剧集 ${bundle.name} 第${index + 1}集未注入贵州媒资系统`)
          }
        }
        console.log('=================================================')
        console.log('')
        for (let video of bundle.videos) {
          if (!video.assetId) {
            data.splice(bIndex, 1)
            break
          }
        }
      }
      //获得Excel模板的buffer对象
      try {
        var exlBuf = fs.readFileSync(path.join(__dirname, '../template/guizhou_template.xlsx'))
      } catch (e) {
        return res.json({
          code: 500,
          msg: e
        })
      }
      //添加图片服务器的地址
      const imgHost = config.images_server
      data.imgHost = imgHost
      //用数据源(对象)data渲染Excel模板
      return ejsExcel.renderExcelCb(exlBuf, data, function (err, exlBuf2) {
        if (err) {
          return res.json({
            code: 500,
            msg: err
          })
        }
        var newExcelName = "guizhouExcel.xlsx"
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
    })
    .catch((e) => {
      return res.json({
        code: 500,
        msg: e
      })
    })

})

module.exports = router