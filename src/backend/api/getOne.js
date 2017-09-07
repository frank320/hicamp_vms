/**
 * Created by frank on 2017/5/4.
 */
const router = require('express').Router()
const Album = require('../model/album')

/*
 * GET
 * 获取资源列表
 * */
router.get('/getOne', (req, res)=> {
  const id = req.query.id
  if (!id) {
    return res.json({
      code: 400,
      msg: '参数错误'
    })
  }
  Album.findOne({
      id: id
    })
    .then(r=> {
      res.json({
        code: 200,
        data: r
      })
    }).catch(err=> {
    res.json({
      code: 500,
      msg: err
    })

  })
})
module.exports = router