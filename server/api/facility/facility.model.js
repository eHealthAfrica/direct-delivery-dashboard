'use strict';

var q = require('q');
var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('facilities');

// use promises for caching across all requests
var allPromise = null;

// clear cache on db changes
db.changes().on('change', function() {
  db.cache.purge();
  allPromise = null;
});

// exports
exports.all = all;

function all(cb) {
  if (!allPromise) {
    var d = q.defer();
    allPromise = d.promise;

    db.all({ include_docs: true }, function(err, rows) {
      if (err)
        d.reject(err);
      else
        d.resolve(rows);
    });
  }

  allPromise
    .then(function(rows) {
      cb(null, utility.removeDesignDocs(rows.toArray()));
    })
    .catch(function(err) {
      allPromise = null;
      cb(err);
    })
}
