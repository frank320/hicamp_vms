/**
 * Created by frank on 2017/4/24.
 */
const path = require('path')

module.exports = {
  port: 8080,
  dbbase: 'mongodb://localhost:27017/vms',
  //剧集同步接口
  pushServer: 'http://localhost:8030/api/backend/vms/bundle',
  //upload files path
  resourcePath: path.join(__dirname, '../../resource/'),
  staicRoute: '/static',
  prefix: '/vms',
  //登录账户设置
  account: 'admin',
  password: 'admin'
}