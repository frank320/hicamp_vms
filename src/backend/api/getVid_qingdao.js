/**
 * Created by wikeLi on 2017/6/9.
 */
const fs = require("fs")
const path = require('path')

const router = require('express').Router()
const template = require("art-template")
const moment = require('moment')
const fetch = require('node-fetch')


const config = require('../config')
const Album = require('../model/album')

template.config('extname', '.xml')
template.config('base', path.join(__dirname, '../template'))


router.post('/getVid', (req, res)=> {
  const id = req.body.id
  const currentTime = moment(+new Date()).format('YYYY-MM-DD HH:mm:ss')
  const hisenServer = 'http://10.240.2.13:8080/bddh'//正式系统 http://10.240.3.253:8080/bddh
  const TransactionID = 'tuxing'////只是在并发请求时，标识会话用的，可以随便一个字符串。返回的信息里会带有请求的这个字符串，标识这是哪条请求的返回
  const OpCode = 'CMS_CODE_QUERY'//查询节目ID的接口，就是CMS_CODE_QUERY这个固定字符串
  const MsgType = 'REQ'//消息类型 REQ：消息请求 RESP：消息响应
  const PartnerCode = 64//是海信分配的运营商ID 正式平台固定是68
  const Version = 1.0
  const assetsArray = [
    {code: '001', name: '第一集'},
    {code: '002', name: '第二集'},
  ]

  const postData = {hisenServer, TransactionID, OpCode, MsgType, PartnerCode, Version, assetsArray}

  const postXml = template('qindao_template', postData)
  Object.assign(postData, {
    Timestamp: moment(+new Date()).format('YYYY-MM-DD HH:mm:ss')
  })
  console.log(postXml)
  fetch(hisenServer, {
    method: 'POST',
    body: postXml,
    headers: {'Content-Type': 'text/xml'}
  }).then(r=>
    r.json()
  ).then(()=> {
    res.end('ok')
  })


//return Album
//  .findOne({id: id})
//  .then(data=> {
//    data.currentTime = currentTime
//    data.fileServer = fileServer
//    const xml = template('xml_template', data)
//    const xmlName = `${data.name}.xml`
//    try {
//      fs.writeFileSync(path.join(config.resourcePath, 'adi_xml', xmlName), xml)
//    } catch (e) {
//      res.json({
//        code: 500,
//        msg: '文件保存出错'
//      })
//    }
//    const xmlPath = config.prefix + config.staicRoute + '/adi_xml/' + xmlName
//
//    res.json({
//      code: 200,
//      xmlPath: xmlPath
//    })
//  })
//  .catch(err=> {
//    res.json({
//      code: 500,
//      msg: err
//    })
//  })

})

module.exports = router