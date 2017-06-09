/**
 * Created by frank on 2017/5/16.
 */
const router = require('express').Router()
const fs = require("fs")
const path = require('path')
const ejsExcel = require("ejsexcel")

const config = require('../config')
const Album = require('../model/album')

router.post('/generateExcel', (req, res)=> {
  const checkList = JSON.parse(req.body.checkList)
  return Album
    .find({
      id: {$in: checkList}
    })
    .then(data=> {
      //获得Excel模板的buffer对象
      try {
        var exlBuf = fs.readFileSync(path.join(__dirname, '../template/excel_template.xlsx'))
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
        var newExcelName = "daoExcel.xlsx"
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
    .catch((e)=> {
      return res.json({
        code: 500,
        msg: e
      })
    })

})

module.exports = router