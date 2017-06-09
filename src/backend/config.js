/**
 * Created by frank on 2017/4/24.
 */
const path = require('path')

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
  //images_server host
  images_server: process.env.IMAGES_SERVER || 'http://192.168.1.101:9000/static',
  //登录账户设置
  account: process.env.ACCOUNT || 'admin',
  password: process.env.PASSWORD || 'admin',
  cookieExp: Number(process.env.COOKIE_EXP || 2)
}