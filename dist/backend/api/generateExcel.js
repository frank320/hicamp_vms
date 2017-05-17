'use strict';

/**
 * Created by frank on 2017/5/16.
 */
var router = require('express').Router();
var fs = require("fs");
var path = require('path');
var ejsExcel = require("ejsExcel");

var config = require('../config');
var Album = require('../model/album');

router.post('/generateExcel', function (req, res) {
  var checkList = JSON.parse(req.body.checkList);
  return Album.find({
    id: { $in: checkList }
  }).then(function (data) {
    //获得Excel模板的buffer对象
    try {
      var exlBuf = fs.readFileSync(path.join(__dirname, '../excelTemplate/content_template.xlsx'));
    } catch (e) {
      return res.json({
        code: 500,
        msg: e
      });
    }
    //用数据源(对象)data渲染Excel模板
    return ejsExcel.renderExcelCb(exlBuf, data, function (err, exlBuf2) {
      if (err) {
        return res.json({
          code: 500,
          msg: err
        });
      }
      var newExcelName = "template.xlsx";
      try {
        fs.writeFileSync(config.resourcePath + newExcelName, exlBuf2);
      } catch (e) {
        return res.json({
          code: 500,
          msg: e
        });
      }
      return res.json({
        code: 200,
        excelPath: config.prefix + config.staicRoute + '/' + newExcelName
      });
    });
  }).catch(function (e) {
    return res.json({
      code: 500,
      msg: e
    });
  });
});

module.exports = router;