'use strict';

angular.module('reports')
  .service('reportsService', function(pouchDB, config, TIME_SLOTS) {
    var db = pouchDB(config.db);

    this.getDeliveryRounds = function() {
      return db.query('reports/delivery-rounds')
        .then(function(response) {
          return response.rows.map(function(row) {
            return {
              _id: row.id,
              state: row.key[0],
              startDate: new Date(row.key[1]),
              endDate: new Date(row.value.endDate),
              roundCode: row.value.roundCode
            };
          });
        });
    };

    this.getDailyDeliveries = function(roundId) {
      return db
        .query('reports/daily-deliveries', {
          startkey: [roundId],
          endkey: [roundId, {}, {}, {}]
        })
        .then(function(response) {
          return response.rows.map(function(row) {
            var signedAt = new Date(row.value.signature.signedAt);

            return {
              driverID: row.key[1],
              date: row.key[2],
              drop: row.key[3],
              timeSlot: TIME_SLOTS[signedAt.getHours()],
              signature: row.value.signature.dataUrl,
              facility: row.value.facility
            };
          });
        });
    };
  });
