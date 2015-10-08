'use strict'

var path = require('path')
var conf = require('./gulp/conf')

var extend = require('extend')
var wiredep = require('wiredep')

function listFiles () {
  var wiredepOptions = extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  })

  return wiredep(wiredepOptions).js
    .concat([
      path.join(conf.paths.src, '/app/**/*.module.js'),
      path.join(conf.paths.src, '/app/**/*.js'),
      path.join(conf.paths.src, '/**/*.spec.js'),
      path.join(conf.paths.src, '/**/*.mock.js'),
      path.join(conf.paths.src, '/**/*.html')
    ])
}

module.exports = function (config) {
  var configuration = {
    files: listFiles(),

    singleRun: true,

    autoWatch: false,

    frameworks: ['jasmine', 'angular-filesort'],

    angularFilesort: {
      whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'directDeliveryDashboard'
    },

    browsers: ['PhantomJS'],

    reporters: [
      'progress',
      'coverage'
    ],

    preprocessors: {
      'src/**/*.html': ['ng-html2js'],
      'src/app/**/!(*.spec|*.mock).js': ['coverage']
    },

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'lcov',
          subdir: 'lcov'
        }
      ]
    }
  }

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if (configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
    configuration.browsers = ['chrome-travis-ci']
  }

  config.set(configuration)
}
