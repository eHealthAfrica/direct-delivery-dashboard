'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('bundle');

exports.all = all;

function all(cb) {
  db.all({ include_docs: true }, function(err, rows) {
    if (err) return cb(err);

    return cb(null, clean(rows.toArray()));
  });
}

// remove design docs and make sure 'sendingFacility' and 'receivingFacility' are facility ids, not objects.
function clean(bundles) {
  return bundles.filter(function(bundle) {
    var include = utility.isNotDesignDoc(bundle) && bundle.sendingFacility && bundle.receivingFacility;

    if (include) {
      if (bundle.sendingFacility._id)
        bundle.sendingFacility = bundle.sendingFacility._id;
      if (bundle.receivingFacility._id)
        bundle.receivingFacility = bundle.receivingFacility._id;
    }

    return include;
  });
}
