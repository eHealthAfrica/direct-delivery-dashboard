'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('app_config');

exports.get = get;

function get(cb) {
  db.view('app_config/by_id', function(err, rows) {
    if (err){
      return cb(err);
    }
    return cb(null, rows.toArray());
  });
}
