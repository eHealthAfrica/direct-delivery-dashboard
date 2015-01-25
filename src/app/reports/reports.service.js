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
          endkey: [roundId, {}, {}]
        })
        .then(function(response) {
          var rows = [];
          var byDate = {};

          response.rows.forEach(function(row) {
            var date = row.key[1];
            if (byDate[date] === undefined) {
              byDate[date] = {date: date, rows: []};
              rows.push(byDate[date]);
            }

            byDate[date].rows.push({
              timeSlot: TIME_SLOTS[parseInt(row.key[2])],
              driverID: row.value.driverID,
              facility: row.value.facility
            });
          });

          return rows;
        });
    };
  });
