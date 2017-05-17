'use strict';

/**
 * Created by frank on 2017/5/16.
 */
/**
 * Created by wikeLi on 2017/4/25.
 */
var router = require('express').Router();
var Album = require('../model/album');

/*
 * GET
 * 获取资源列表
 * */
router.get('/getAll', function (req, res) {
  Album.find({}).sort({ createdTime: -1 }).then(function (r) {
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