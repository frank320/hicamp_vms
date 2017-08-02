/**
 * Created by frank on 2017/4/25.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../config')

const AlbumSchema = new Schema({
  protocaltype: {//操作类型：0 添加，1 更新，2 删除
    type: Number,
    require: true,
    default: 0
  },
  copyright: {
    type: String,
    require: true
  },
  id: {
    type: String,
    unique: true,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  summary: {
    type: String,
    require: true
  },
  tags: {
    type: Array,
    require: true
  },
  score: {
    type: Number,
    require: true
  },
  minAge: {
    type: Number,
    require: true
  },
  maxAge: {
    type: Number,
    require: true
  },
  createdTime: {
    type: Number,
    require: true,
    default: Date.now()
  },
  updateTime: {
    type: Number,
    require: true,
    default: Date.now()
  },
  posterLarge: {
    type: String,
    require: true
  },
  posterSmall: {
    type: String,
    require: true
  },
  videos: {
    type: Array,
    require: true,
    default: []
  },
  isAlbum: {
    type: Number,
    require: true,
    default: 1
  },
  vip: {
    type: Number,
    require: true,
    default: 1
  },
  isOnline: {//资源是否上线
    type: Number,
    require: true,
    default: 0
  }

})

//连接数据库
mongoose.Promise = global.Promise
const mongo1 = mongoose.createConnection(config.dbbase)
mongo1.once('open', (err)=> {
  if (err) {
    console.err(err)
  } else {
    console.log('mongodb connect successfully')
  }
})
mongo1.on('error', console.error.bind(console, 'connection error:'))

module.exports = mongo1.model('Album', AlbumSchema)