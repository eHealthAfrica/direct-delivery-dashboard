/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// -----------------------------------------------------------------------
// fix for cradle's 'forEach' function
// remove and update cradle when it has been fixed
//
var cradleResponse = require('cradle/lib/cradle/response');
cradleResponse.collectionPrototype.forEach = function(f) {
  for (var i = 0, value; i < this.length; i++) {
    value = this[i].doc;
    if (value === undefined)
      value = this[i].json;
    if (value === undefined)
      value = this[i].value;
    if (value === undefined)
      value = this[i];

    if (f.length === 1) {
      f.call(this[i], value);
    }
    else {
      f.call(this[i], this[i].key, value, this[i].id);
    }
  }
};
// -----------------------------------------------------------------------

var express = require('express');
var config = require('./config/environment');
var cradle = require('cradle');

// Setup couchDB connection
cradle.setup(config.couch);

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

//log exceptions without halting system
process.on('uncaughtException', function (err) {
  console.log(err);
});
// Start server
server.listen(config.port, config.ip, function() {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
var exports = module.exports = app;
