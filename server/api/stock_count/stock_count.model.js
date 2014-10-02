'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('stockcount');

exports.all = all;
exports.unopened = unopened;

function all(cb) {
  db.all({ include_docs: true }, function(err, rows) {
    if (err) return cb(err);

    return cb(null, utility.removeDesignDocs(rows.toArray()));
  });
}

function unopened(cb) {
  var opts = {
    reduce: true,
    group: true,
    group_level: 3
  };

  db.view('stockcount/unopened', opts, function(err, res) {
    if (err) return cb(err);

    var items = {};
    res.forEach(function(key, value, id) {
      var k = key[0] + key[1];
      items[k] = items[k] || {
        facility: key[0],
        date: new Date(key[1]),
        products: {}
      };

      items[k].products[key[2]] = { count: value };
    });

    var rows = Object.keys(items)
      .map(function(key) {
        return items[key];
      })
      .sort(function(a, b) {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
      });

    return cb(null, rows);
  });
}
