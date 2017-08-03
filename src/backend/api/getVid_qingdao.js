/**
 * Created by wikeLi on 2017/6/9.
 */
const fs = require("fs")
const path = require('path')

const router = require('express').Router()
const template = require("art-template")
const moment = require('moment')
const fetch = require('node-fetch')
const { parseString } = require('xml2js')


const config = require('../config')
const Album = require('../model/album')

template.config('extname', '.xml')
template.config('base', path.join(__dirname, '../template'))


router.get('/getQdVid', (req, res)=> {
  const vid = req.query.vid
  //const hisenServer = 'http://10.240.2.13:8080/bddh'//正式系统 http://10.240.3.253:8080/bddh
  const hisenServer = 'http://10.240.3.253:8080/bddh'//正式系统 http://10.240.3.253:8080/bddh
  const TransactionID = 'tx001'//只是在并发请求时，标识会话用的，可以随便一个字符串。返回的信息里会带有请求的这个字符串，标识这是哪条请求的返回
  const OpCode = 'CMS_CODE_QUERY'//查询节目ID的接口，就是CMS_CODE_QUERY这个固定字符串
  const MsgType = 'REQ'//消息类型 REQ：消息请求 RESP：消息响应
  const PartnerCode = 'txcsp'
  const Version = '1.0'
  let assetsArray = null
  return Album
    .findOne({id: vid})
    .then(data=> {
      if (data.videos && data.videos[0].qingdaoVid) {
        return Promise.reject(5188)
      }
      assetsArray = data.videos
      const postData = {hisenServer, TransactionID, OpCode, MsgType, PartnerCode, Version, assetsArray}
      Object.assign(postData, {
        Timestamp: moment(+new Date()).format('YYYY-MM-DD HH:mm:ss')
      })
      const postXml = template('qingdao_template', postData)
      return fetch(hisenServer, {
        method: 'POST',
        body: postXml,
        headers: {'Content-Type': 'application/xml'}
      })
        .then(r=>r.text())
      //for test
      //return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      //            <message>
      //                <header>
      //                    <TransactionID>tx001</TransactionID>
      //                    <Version>1.0</Version>
      //                    <Timestamp>2017-08-03 03:32:29</Timestamp>
      //                    <OpCode>CMS_CODE_QUERY</OpCode>
      //                    <MsgType>RESP</MsgType>
      //                    <ReturnCode>0</ReturnCode>
      //                </header>
      //                <body>
      //                    <Asset>
      //                        <AssetCode>2018080102</AssetCode>
      //                        <PartnerCode>txcsp</PartnerCode>
      //                        <ProgramId>1000000016076</ProgramId>
      //                    </Asset>
      //                    <Asset>
      //                        <AssetCode>2017080101</AssetCode>
      //                        <PartnerCode>txcsp</PartnerCode>
      //                        <ProgramId>1000000016074</ProgramId>
      //                    </Asset>
      //                </body>
      //            </message>`

    })
    .then(resXml=> {
      //parse response xml
      return new Promise((resolve, reject)=> {
        return parseString(resXml, (err, result)=> {
          if (err) {
            return reject(err)
          } else {
            return resolve(result)
          }
        })
      })
    })
    .then(data=> {
      //get ProgramId data
      return new Promise((resolve, reject)=> {
        if (data && data.message.header[0].ReturnCode[0] == 0) {
          //get programID success
          resolve(data.message.body[0].Asset)
        } else {
          reject('programid查询returncode值为:' + data.message.header[0].ReturnCode[0])
        }
      })
    })
    .then(data=> {
      if (data.length !== assetsArray.length) {
        return Promise.reject(5189)
      }
      //update videos in mongodb
      for (let {AssetCode,ProgramId} of data) {
        for (let video of assetsArray) {
          if (`hej0TXJY${video.id}` === AssetCode[0]) {
            Object.assign(video, {
              qingdaoVid: ProgramId[0]
            })
            break
          }
        }
      }
      Album.update({id: vid}, {$set: {videos: assetsArray}}).exec()
      return res.json({
        code: 200,
        msg: '操作成功'
      })
    })
    .catch(err=> {
      if (err == 5188) {
        return res.json({
          code: 5188,
          msg: '所选资源的programID已经存在,请选择其他资源'
        })
      }
      if (err == 5189) {
        return res.json({
          code: 5189,
          msg: '获取的programID个数和数据库视频个数不相等'
        })
      }
      return res.json({
        code: 500,
        msg: err
      })
    })


})

module.exports = router