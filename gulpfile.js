/**
 * Created by frank on 2017/4/24.
 */
'use strict'
//gulp-concat 合并 js css
//gulp-uglify 压缩 js
//gulp-cssnano 压缩 css
//gulp-htmlmin 压缩html
//gult-sass 编译css


var gulp = require('gulp')
var gulpLoadPlugins = require('gulp-load-plugins')
var plugins = gulpLoadPlugins()
var runSequence = require('run-sequence')
var del = require('del')

gulp.task('clean', del.bind(null, ['dist/*']))
//转码es6代码
gulp.task('compile', ['clean'], function () {
  return gulp.src(['src/backend/**/*.js'])
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist/backend'))
})
//移动其文件
gulp.task('extrals', ['compile'], function () {
  return gulp.src('src/vms/**/*.*').pipe(gulp.dest('dist/vms'))
})

gulp.task('build', ['extrals'], function () {
  console.log('构建完毕')
})
