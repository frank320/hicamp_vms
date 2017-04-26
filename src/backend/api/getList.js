/**
 * Created by wikeLi on 2017/4/25.
 */
const router = require('express').Router()
const Album = require('../model/album')

/*
 * GET
 * 获取资源列表
 * */
router.get('/getList', (req, res)=> {
  const start = parseInt(req.query.start || 0)
  const limit = parseInt(req.query.limit || 10)
  let totalPage = 1
  Album.count().then(r=> {
      totalPage = Math.ceil(r / limit)
      return Album.find({})
        .sort({createdTime: -1})
        .skip(start)
        .limit(limit)
    })
    .then(r=> {
      res.json({
        code: 200,
        data: r,
        totalPage: totalPage
      })
    }).catch(err=> {
    res.json({
      code: 500,
      data: err
    })

  })
})
module.exports = router