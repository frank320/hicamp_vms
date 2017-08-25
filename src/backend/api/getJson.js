/**
 * Created by wikeLi on 2017/6/9.
 */
const fs = require("fs")
const path = require('path')

const router = require('express').Router()


const config = require('../config')
const Album = require('../model/album')


router.get('/getJson', (req, res) => {
  const checkList = req.query.checkList.split(',')
  return Album
    .find({
      id: {$in: checkList}
    })
    .then(data => {
      let jsonArr = []
      for (let bundle of data) {
        jsonArr.push(Object.assign({}, {
            copyright: bundle.copyright,
            name: bundle.name,
            summary: bundle.summary,
            score: bundle.score,
            minAge: bundle.minAge,
            maxAge: bundle.maxAge,
            posterLarge: bundle.posterLarge,
            posterSmall: bundle.posterSmall,
            id: bundle.id,
            isOnline: bundle.isOnline,
            vip: bundle.vip,
            isAlbum: bundle.isAlbum,
            videos: bundle.videos,
            updateTime: bundle.updateTime,
            createdTime: bundle.createdTime,
            tags: bundle.tags,
            protocaltype: bundle.protocaltype
          }
        ))
      }
      const jsonPath = path.join(config.resourcePath, 'getJson.json')
      try {
        fs.writeFileSync(jsonPath, JSON.stringify(jsonArr))
      } catch (e) {
        return res.json({
          code: 500,
          msg: e
        })
      }
      return res.json({
        code: 200,
        jsonPath: config.prefix + config.staicRoute + '/getJson.json'
      })
    })
    .catch((e) => {
      return res.json({
        code: 500,
        msg: e
      })
    })

})

module.exports = router