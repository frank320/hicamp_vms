/**
 * Created by frank on 2017/5/16.
 */
/**
 * Created by wikeLi on 2017/4/25.
 */
const router = require('express').Router()
const Album = require('../model/album')

/*
 * GET
 * 获取资源列表
 * */
router.get('/getAll', (req, res)=> {
  Album
    .find({})
    .sort({createdTime: -1})
    .then(r=> {
      res.json({
        code: 200,
        data: r
      })
    })
    .catch(err=> {
      res.json({
        code: 500,
        data: err
      })
    })
})
router.get('/getBundleMeta', (req, res)=> {
  Album
    .find({})
    .sort({createdTime: 1})
    .then(r=> {
      const bundleMeta = r.map(v=> {
        return {
          name: v.name,
          id: v.id
        }
      })
      res.json({
        code: 200,
        data: bundleMeta
      })
    })
    .catch(err=> {
      res.json({
        code: 500,
        data: err
      })
    })
})

module.exports = router