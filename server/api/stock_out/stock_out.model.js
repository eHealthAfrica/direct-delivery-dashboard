'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('stock_out');

exports.byDate = byDate;

function byDate(options, cb) {
  var opts = {
    descending: true
  };

  if (options) {
    if (options.limit !== undefined && !isNaN(options.limit))
      opts.limit = parseInt(options.limit);

    if (options.descending !== undefined)
      opts.descending = utility.parseBool(options.descending);
  }

  db.view('stock_out/by_date', opts, function(err, rows) {
    if (err) return cb(err);

    return cb(null, rows.toArray());
  });
}
