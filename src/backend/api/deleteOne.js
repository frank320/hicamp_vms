/**
 * Created by frank on 2017/5/4.
 */

const router = require('express').Router()
const Album = require('../model/album')

/*
 * GET
 * 获取资源列表
 * */
router.delete('/deleteOne', (req, res)=> {
  const id = req.body.id
  if (!id) {
    return res.json({
      code: 400,
      msg: '参数错误'
    })
  }
  Album.deleteOne({
      id: id
    })
    .then(r=> {
      res.json({
        code: 200
      })
    }).catch(err=> {
    res.json({
      code: 500,
      msg: err
    })

  })
})
module.exports = router