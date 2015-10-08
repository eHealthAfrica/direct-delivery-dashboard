'use strict'

var path = require('path')
var gulp = require('gulp')

var karma = require('karma')

function runTests (singleRun, done) {
  var config = {
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }

  function cb (failCount) {
    done(failCount ? new Error('Failed ' + failCount + ' tests.') : null)
  }

  var server = new karma.Server(config, cb)
  server.start()
}

gulp.task('test', ['scripts'], function (done) {
  runTests(true, done)
})

gulp.task('test:auto', ['watch'], function (done) {
  runTests(false, done)
})
