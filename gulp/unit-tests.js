'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var merge = require('merge-stream');

function test(options) {
  var karmaOpts = {
    action: options.action,
    configFile: 'karma.conf.js'
  };

  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = gulp.src(bowerDeps.js);
  var src = gulp.src('src/{app,components}/**/*.js')
    .pipe($.angularFilesort());

  return merge(testFiles, src)
    .pipe($.karma(karmaOpts))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
}

gulp.task('test', ['config'], function() {
  return test({action: 'run'});
});

gulp.task('test-watch', ['config'], function() {
  return test({action: 'watch'});
});
