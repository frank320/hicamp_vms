/**
 * Created by wikeLi on 2017/6/9.
 */
const fs = require("fs")
const path = require('path')

const router = require('express').Router()
const template = require("art-template")
const moment = require('moment')

const config = require('../config')
const Album = require('../model/album')

template.config('extname', '.xml')
template.config('base', path.join(__dirname, '../template'))


router.post('/generateXml', (req, res)=> {
  const id = req.body.id
  const currentTime = moment(+new Date()).format('YYYY-MM-DD HH:mm:ss')
  const fileServer = 'http://101.200.84.44:80/bo/download/TJ/'
  return Album
    .findOne({id: id})
    .then(data=> {
      data.currentTime = currentTime
      data.fileServer = fileServer
      const xml = template('xml_template', data)
      const xmlName = `${data.name}.xml`
      try {
        fs.writeFileSync(path.join(config.resourcePath, 'adi_xml', xmlName), xml)
      } catch (e) {
        res.json({
          code: 500,
          msg: '文件保存出错'
        })
      }
      const xmlPath = config.prefix + config.staicRoute + '/adi_xml/' + xmlName

      res.json({
        code: 200,
        xmlPath: xmlPath
      })
    })
    .catch(err=> {
      res.json({
        code: 500,
        msg: err
      })
    })
})

module.exports = router