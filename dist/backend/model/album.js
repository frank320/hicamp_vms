'use strict';

/**
 * Created by frank on 2017/4/25.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = new Schema({
  protocaltype: { //操作类型：0 添加，1 更新，2 删除
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
  isOnline: { //资源是否上线
    type: Number,
    require: true,
    default: 0
  }

});

module.exports = mongoose.model('Album', AlbumSchema);