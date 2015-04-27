'use strict';
/*eslint-env node */

var pkg = require('../package.json');
var extend = require('extend');

var env = process.env.NODE_ENV || 'development';

var defaults = {
  config: {
    name: pkg.name,
    version: pkg.version,
    author: pkg.author
  }
};

var config = {
  config: require('./' + env + '.json')
};

config.config.baseUrl = config.config.db.replace(/\/[^\/]+\/?$/, '');

module.exports = extend(true, {}, defaults, config);
