/**
 * Created by frank on 2017/4/24.
 */
'use strict'
//gulp-concat 合并 js css
//gulp-uglify 压缩 js
//gulp-cssnano 压缩 css
//gulp-htmlmin 压缩html
//gult-sass 编译css
//browser-sync 同步刷新


var gulp = require('gulp')
var browserSync = require('browser-sync')


//实时更新
gulp.task('default', function () {
  browserSync.init({
    server: './dist',//服务器打开的目录
    files: ['./dist/**/*.*'],//需要监视的文件
    port: 80//自定义的端口号
  })
})