'use strict';
/*eslint-env node */

var pkg = require('../package.json');
var url = require('url');
var extend = require('extend');

var env = process.env.NODE_ENV || 'development';

var defaults = {
  config: {
    name: pkg.name,
    version: pkg.version,
    dateFormat: 'yyyy-MM-dd',
    admin: {
      roles: [
        'direct_delivery_dashboard_super'
      ]
    },
    user: {
      roles: [
        'direct_delivery_dashboard_accounting',
        'direct_delivery_dashboard_stakeholder',
        'direct_delivery_dashboard_gis'
      ]
    }
  }
};

var config = {
  config: require('./' + env + '.json')
};

var parsedUrl = url.parse(config.config.db);
config.config.baseUrl = parsedUrl.href.split(parsedUrl.path)[0];

module.exports = extend(true, {}, defaults, config);
