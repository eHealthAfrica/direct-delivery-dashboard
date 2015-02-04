'use strict';

angular.module('reports')
  .service('reportsService', function(pouchDB, config) {
    var db = pouchDB(config.db);

    this.getDeliveryRounds = function() {
      return db.query('reports/delivery-rounds')
        .then(function(response) {
          return response.rows.map(function(row) {
            return {
              id: row.id,
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
            return {
              id: row.id,
              driverID: row.key[1],
              date: new Date(row.key[2]),
              drop: row.key[3],
              status: row.value.status,
              window: row.value.window,
              cancelReport: row.value.cancelReport,
              signature: row.value.signature,
              facility: row.value.facility
            };
          });
        });
    };
  });
