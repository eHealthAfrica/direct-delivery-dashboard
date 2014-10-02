'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('app_config');

exports.get = get;

function get(cb) {
  db.temporaryView({
    map: function(doc) {
      emit(doc.id, {
        _id: doc._id,
        uuid: doc.uuid,
        rev: doc._rev,
        facility: {
          _id: doc.facility._id,
          name: doc.facility.name,
          reminderDay: doc.facility.reminderDay,
          stockCountInterval: doc.facility.stockCountInterval
        }
      });
    }
  }, function(err, rows) {
    if (err) return cb(err);

    cb(null, rows.toArray());
  });
}
