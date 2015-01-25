'use strict';

angular.module('reports')
  .service('reportsService', function(pouchDB, config) {
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
  });
