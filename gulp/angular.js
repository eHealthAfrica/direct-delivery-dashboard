'use strict';

var fs = require('fs');
var gulp = require('gulp');
var config = require('../config');
var ngConfig = require('ng-config');

gulp.task('ngConfig', function () {
  var options = {
    constants: config
  };
  var ngconf = ngConfig(options);
  return fs.writeFileSync('src/app/config.js', ngconf);
});
