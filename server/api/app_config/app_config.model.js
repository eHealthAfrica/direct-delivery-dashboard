'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('app_config');

exports.get = get;
exports.all = all;

function get(cb) {
  db.view('app_config/by_id', function(err, rows) {
    if (err){
      return cb(err);
    }
    return cb(null, rows.toArray());
  });
}

function all(cb){
  db.all({ include_docs: true }, function(err, rows){
    if (err){
      return cb(err);
    }
    return cb(null, rows.toArray());
  });
}
