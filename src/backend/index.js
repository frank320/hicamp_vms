/**
 * Created by frank on 2017/4/24.
 */
const path = require('path')
const fs = require('fs')
const os = require('os')

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const glob = require('glob')
const mongoose = require('mongoose')

const config = require('./config')


//错误处理
function defaultErrorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && !res.headersSent) {
    res.json({
      code: 400,
      msg: "Error throw: bad json data"
    })
  } else {
    console.error(err.stack);
    if (res.headersSent) {
      next(err)
    } else {
      res.status(500).send('Sorry, server error: ' + err)
    }
  }
}

//静态资源处理
app.use(config.prefix, express.static(path.join(__dirname, '../vms')))
app.use(config.prefix + config.staicRoute, express.static(config.resourcePath))


app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//载入路由
glob.sync('./api/**/*.js', {cwd: __dirname}).forEach(item => {
  const controller = require(item)
  app.use(config.prefix, controller)
})

// Use native promises in mongoose
mongoose.Promise = global.Promise
// 连接数据库
mongoose.connection.once('open', ()=> {
  console.log('mongodb connect successfully')
})
mongoose.connection.on('error', console.error.bind(console, 'connection error'))
mongoose.connect(config.dbbase)


//错误处理
app.use(defaultErrorHandler)

//监听一个端口
app.listen(config.port, err=> {
  if (err) throw err
  console.log(`server is running at port ${config.port}`)
})
