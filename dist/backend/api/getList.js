'use strict';

/**
 * Created by wikeLi on 2017/4/25.
 */
var router = require('express').Router();
var Album = require('../model/album');

/*
 * GET
 * 获取资源列表
 * */
router.get('/getList', function (req, res) {
  var start = parseInt(req.query.start || 0);
  var limit = parseInt(req.query.limit || 10);
  var totalPage = 1;
  Album.count().then(function (r) {
    totalPage = Math.ceil(r / limit);
    return Album.find({}).sort({ createdTime: -1 }).skip(start).limit(limit);
  }).then(function (r) {
    res.json({
      code: 200,
      data: r,
      totalPage: totalPage
    });
  }).catch(function (err) {
    res.json({
      code: 500,
      data: err
    });
  });
});
module.exports = router;