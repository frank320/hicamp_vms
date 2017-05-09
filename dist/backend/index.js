'use strict';

/**
 * Created by frank on 2017/4/24.
 */
var path = require('path');
var fs = require('fs');
var os = require('os');

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var glob = require('glob');
var mongoose = require('mongoose');

var config = require('./config');

//错误处理
function defaultErrorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && !res.headersSent) {
    res.json({
      code: 400,
      msg: "Error throw: bad json data"
    });
  } else {
    console.error(err.stack);
    if (res.headersSent) {
      next(err);
    } else {
      res.status(500).send('Sorry, server error: ' + err);
    }
  }
}

//静态资源处理
app.use(config.prefix, express.static(path.join(__dirname, '../vms')));
app.use(config.prefix + config.staicRoute, express.static(config.resourcePath));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//api权限验证
function auth(req, res, next) {
  var api = req.path;
  //bypass the authentification handler itself
  if (api === '/login') {
    return next();
  }
  if (!req.cookies.vms_token) {
    return res.json({
      code: 401,
      msg: 'unauthorized'
    });
  } else {
    //重新设置过期时间
    res.cookie('token', req.cookies.vms_token, {
      path: '/vms',
      maxAge: config.cookieExp * 60 * 60 * 1000
    });
    return next();
  }
}
app.use(config.prefix, auth);

//载入路由
glob.sync('./api/**/*.js', { cwd: __dirname }).forEach(function (item) {
  var controller = require(item);
  app.use(config.prefix, controller);
});

// Use native promises in mongoose
mongoose.Promise = global.Promise;
// 连接数据库
mongoose.connection.once('open', function () {
  console.log('mongodb connect successfully');
});
mongoose.connection.on('error', console.error.bind(console, 'connection error'));
mongoose.connect(config.dbbase);

//错误处理
app.use(defaultErrorHandler);

//监听一个端口
app.listen(config.port, function (err) {
  if (err) throw err;
  console.log('server is running at port ' + config.port + ',the runtime is ' + process.env.NODE_ENV);
});