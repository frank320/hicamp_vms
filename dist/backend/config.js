'use strict';

/**
 * Created by frank on 2017/4/24.
 */
var path = require('path');

module.exports = {
  port: Number(process.env.PORT || 8090),
  dbbase: process.env.DB_BASE || 'mongodb://localhost:27017/vms',
  //剧集同步接口
  pushServer: process.env.PUSH_SERVER || 'http://localhost:8030/api/backend/vms/bundle',
  //upload files path
  resourcePath: process.env.RESOURCE_PATH || path.join(__dirname, '../../resource/'),
  //static resource route
  staicRoute: process.env.STATIC_ROUTE || '/static',
  prefix: process.env.PREFIX || '/vms',
  //登录账户设置
  account: process.env.ACCOUNT || 'admin',
  password: process.env.PASSWORD || 'admin',
  cookieExp: Number(process.env.COOKIE_EXP || 2)
};