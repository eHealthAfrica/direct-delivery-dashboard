'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('app_config');

exports.get = get;
exports.all = all;
exports.find = find;
exports.put = put;

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

function find(id, cb){
  db.get(id, function(err, row){
    if (err){
      return cb(err);
    }
    return cb(null, row);
  });
}

function put(id, data, cb){
  db.merge(id, data, function(err, row){
    if (err){
      return cb(err);
    }
    return cb(null, row);
  });
}
