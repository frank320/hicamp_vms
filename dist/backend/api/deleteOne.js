'use strict';

/**
 * Created by frank on 2017/5/4.
 */

var router = require('express').Router();
var Album = require('../model/album');

/*
 * GET
 * 获取资源列表
 * */
router.delete('/deleteOne', function (req, res) {
  var id = req.body.id;
  if (!id) {
    return res.json({
      code: 400,
      msg: '参数错误'
    });
  }
  Album.deleteOne({
    id: id
  }).then(function (r) {
    res.json({
      code: 200
    });
  }).catch(function (err) {
    res.json({
      code: 500,
      data: err
    });
  });
});
module.exports = router;