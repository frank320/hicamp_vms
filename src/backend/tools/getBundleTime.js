/**
 * Created by frank on 2017/5/16.
 */
const fs = require("fs")
const path = require('path')
const ejsExcel = require("ejsexcel")

const Album = require('../model/album')
const config = require('../config')

//格式化时间
function formatTime(second) {
  second = parseInt(second)
  return [parseInt(second / 60 / 60), parseInt(second / 60) % 60, second % 60].join(":")
    .replace(/\b(\d)\b/g, "0$1");
}

function getSeconds(time) {
  const arr = time.split(':')
  return arr[0] * 3600 + arr[1] * 60 + arr[2] * 1
}

Album
  .find({})
  .sort({createdTime: 1})
  .then(data => {
      //统计时间
      let xsd = 0
      for (let [index, bundle] of data.entries()) {
        let bundleTime = 0
        for (let video of bundle.videos) {
          bundleTime += getSeconds(video.duration)
        }
        xsd += bundleTime
        bundle.bundleTime = formatTime(bundleTime)
      }
      console.log(formatTime(xsd))

      //获得Excel模板的buffer对象
      try {
        var exlBuf = fs.readFileSync(path.join(__dirname, '../template/bundleInfo_template.xlsx'))
      } catch (e) {
        console.log(e.message)
      }
      //用数据源(对象)data渲染Excel模板
      return ejsExcel.renderExcelCb(exlBuf, data, function (err, exlBuf2) {
        if (err) {
          return console.log(err)
        }
        var newExcelName = "bundleInfo.xlsx"
        try {
          fs.writeFileSync(config.resourcePath + newExcelName, exlBuf2)
        } catch (e) {
          console.log(e.message)
        }
        console.log(`生成表格 ${newExcelName} 成功!`)
      })
    }
  )
  .catch((e) => {

  })

