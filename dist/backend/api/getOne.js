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
router.get('/getOne', function (req, res) {
  var id = req.query.id;
  if (!id) {
    return res.json({
      code: 400,
      msg: '参数错误'
    });
  }
  Album.findOne({
    id: id
  }).then(function (r) {
    res.json({
      code: 200,
      data: r
    });
  }).catch(function (err) {
    res.json({
      code: 500,
      data: err
    });
  });
});
module.exports = router;