'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// Check for required env vars
requiredProcessEnv('SESSION_SECRET');

// Non configurable settings
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // CouchDB options
  couch: {
    forceSave: false
  }
};

// Configurable settings come from 3 places with this precedence: env vars, env config then default values.
var env = {
  // Server IP
  ip: process.env.IP,

  // Server port
  port: process.env.PORT,

  // Secret for session
  secrets: {
    session: process.env.SESSION_SECRET
  },

  // CouchDB connection options
  couch: {
    host: process.env.COUCH_HOST,
    port: process.env.COUCH_PORT,
    auth: null
  }
};

if (process.env.COUCH_USER && process.env.COUCH_PASS) {
  env.couch.auth = {
    username: process.env.COUCH_USER,
    password: process.env.COUCH_PASS
  };
}

var defaults = {
  port: 9000,
  couch: {
    host: '',
    port: 5984
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
var configFile = process.env.NODE_CONFIG || process.env.NODE_ENV;
var config = require('./' + configFile + '.js') || {};

module.exports = _.merge(defaults, config, env, all);
