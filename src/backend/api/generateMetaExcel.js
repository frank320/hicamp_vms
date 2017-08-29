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
        //处理data
        let dataArr = []
        for (let bundle of data) {
          if (filterData.includes(bundle.id)) {
            for (let video of bundle.videos) {
              video.isSD = 1
            }
          }
          dataArr.push(...bundle.videos)
        }
        //获得Excel模板的buffer对象
        try {
          var exlBuf = fs.readFileSync(path.join(__dirname, '../template/meta_template.xlsx'))
        } catch (e) {
          return res.json({
            code: 500,
            msg: e
          })
        }

        //用数据源(对象)data渲染Excel模板
        return ejsExcel.renderExcelCb(exlBuf, dataArr, function (err, exlBuf2) {
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