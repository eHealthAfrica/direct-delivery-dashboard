'use strict';

var bowerJS = require('wiredep')({
  exclude: [
    'bootstrap-sass-official'
  ],
  devDependencies: true
}).js;

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: bowerJS.concat([
      'design_docs/**/*.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ]),
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
