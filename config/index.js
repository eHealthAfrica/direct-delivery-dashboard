'use strict'

var url = require('url')
var extend = require('extend')

var pkg = require('../package.json')
var roles = require('./roles')

var env = process.env.NODE_ENV || 'development'

var defaults = {
  config: {
    name: pkg.name,
    version: pkg.version,
    dateFormat: 'yyyy-MM-dd',
    roles: roles()
  }
}

var config = {
  config: require('./' + env + '.json')
}

var parsedUrl = url.parse(config.config.db)
config.config.baseUrl = parsedUrl.href.split(parsedUrl.path)[0]

module.exports = extend(true, {}, defaults, config)
