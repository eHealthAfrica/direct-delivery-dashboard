'use strict';
/*eslint-env node */

module.exports = function(config) {
  config.set({
    autoWatch: false,
    frameworks: [
      'jasmine'
    ],
    browsers: [
      'PhantomJS'
    ],
    reporters: [
      'progress',
      'coverage'
    ],
    preprocessors: {
      'src/{app,components}/**/!(*.spec|*.mock).js': [
        'coverage'
      ]
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage'
    }
  });
};
