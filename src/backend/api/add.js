/**
 * Created by frank on 2017/4/25.
 */
const path = require('path')
const fs = require('fs')
const os = require('os')
const formidable = require('formidable')
const router = require('express').Router()

const config = require('../config')
const Album = require('../model/album')

//获取本机的ip地址
function getLocalIP() {
  var ifaces = os.networkInterfaces();
  var ip = 'localhost'
  for (var dev in ifaces) {
    //服务器ip
    if (dev.indexOf('eth0') != -1) {
      var tokens = dev.split(':');
      var dev2 = null;
      if (tokens.length == 2) {
        dev2 = 'eth1:' + tokens[1];
      } else if (tokens.length == 1) {
        dev2 = 'eth1';
      }
      if (null == ifaces[dev2]) {
        continue;
      }
      // 找到eth0和eth1分别的ip
      var ip = null, ip2 = null;
      ifaces[dev].forEach(function (details) {
        if (details.family == 'IPv4') {
          ip = details.address;
        }
      });
      ifaces[dev2].forEach(function (details) {
        if (details.family == 'IPv4') {
          ip2 = details.address;
        }
      });
      if (null == ip || null == ip2) {
        continue;
      }
      // 将记录添加到map中去
      if (ip.indexOf('10.') == 0 ||
        ip.indexOf('172.') == 0 ||
        ip.indexOf('192.') == 0) {
        return ip2;
      } else {
        return ip;
      }
    }
    //局域网ip
    if (dev == 'WLAN' || dev == '无线网络连接') {
      ifaces[dev].forEach(function (v) {
        if (v.family == 'IPv4') {
          ip = v.address
        }
      })
      return ip
    }
    //服务器局域网ip
    if (dev == '本地连接') {
      ifaces[dev].forEach(function (v) {
        if (v.family == 'IPv4') {
          ip = v.address
        }
      })
      return ip
    }
  }
  return ip
}


router.post('/add', function (req, res) {
  const form = new formidable.IncomingForm()

  // 指定本次文件上传的路径（默认保存到操作系统的临时目录了）
  form.uploadDir = config.resourcePath

  // 指定本次上传的文件保持扩展名（默认是false，没有扩展名）
  form.keepExtensions = true
  form.parse(req, function (err, fields, files) {
    const uploadData = {
      copyright: fields.copyright,
      id: fields.contentcode,
      name: fields.name,
      summary: fields.summary,
      tags: JSON.parse(fields.tags),
      score: parseInt(fields.score),
      minAge: parseInt(fields.minAge),
      maxAge: parseInt(fields.maxAge),
      vip: parseInt(fields.vip),
      isAlbum: parseInt(fields.isAlbum),
      createdTime: Date.now(),
      updateTime: Date.now()
    }

    //文件重命名 保持原有的命名
    let posterLargeName = ''
    let posterSmallName = ''
    try {
      if (files.posterLarge && files.posterLarge.name && files.posterLarge.type.startsWith('image')) {
        posterLargeName = 'large_' + files.posterLarge.name
        fs.renameSync(files.posterLarge.path, path.join(config.resourcePath, posterLargeName))
      }
      if (files.posterSmall && files.posterSmall.name && files.posterSmall.type.startsWith('image')) {
        posterSmallName = 'small_' + files.posterSmall.name
        fs.renameSync(files.posterSmall.path, path.join(config.resourcePath, posterSmallName))
      }


    } catch (e) {
      res.json({
        code: 0,
        msg: '文件保存出错'
      })
    }
    let localIp = getLocalIP()

    function imgUrl(imgName) {
      return `http://${localIp}:${config.port}${config.prefix}${config.staicRoute}/${imgName}`
    }

    uploadData.posterLarge = imgUrl(posterLargeName)
    uploadData.posterSmall = imgUrl(posterSmallName)
    //存入数据库
    const album = new Album(uploadData)
    album.save()
      .then(()=> {
        res.json({
          code: 200,
          msg: '存入成功'
        })
      }).catch(e=> {
      res.json({
        msg: e
      })
    })
  })

})

module.exports = router