/**
 * Created by wikeLi on 2017/4/25.
 */
const router = require('express').Router()
const config = require('../config')
const Album = require('../model/album')
const fetch = require('node-fetch')

router.post('/pushToCMS', (req, res)=> {
  //拿到资源id
  const bid = req.body.id
  const needOffline = parseInt(req.body.needOffline)
  if (!bid) {
    return res.json({
      code: 400,
      msg: '请求参数有误'
    })
  }
  //默认是上线 //< integer of 0/1/2 > 操作类型：0 添加，1 更新，2 删除 protocaltype
  let protocoltype = 0
  if (needOffline) {
    //下线
    protocoltype = 2
  }
  return Album.findOne({id: bid})
    .then(r=> {
      let pushData = {
        protocoltype: protocoltype,
        copyright: r.copyright,
        id: r.id,
        name: r.name,
        summary: r.summary,
        tags: r.tags,
        score: r.score,
        minAge: r.minAge,
        maxAge: r.maxAge,
        createdTime: r.createdTime,
        updateTime: r.updateTime,
        posterLarge: r.posterLarge,
        posterSmall: r.posterLarge,
        videos: r.videos,

        vip: r.vip,
        isAlbum: r.isAlbum

      }
      const data = {
        series: [pushData]
      }
      return fetch(config.pushServer, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      }).then(r=>
        r.json()
      )
    })
    .then(r=> {
        //{code:0} success
        if (r.code === 0) {
          //添加成功 修改数据库里isOnline值
          let isOnline = 1
          if (needOffline) {
            isOnline = 0
          }
          Album.update({id: bid}, {$set: {isOnline: isOnline}}).exec()
          res.json({
            code: 200
          })
        } else {
          res.json({
            code: 400
          })
        }
      }
    )
    .catch(err=> {
      res.json({
        code: 500,
        msg: err
      })

    })

})


module.exports = router