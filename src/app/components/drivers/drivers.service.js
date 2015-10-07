'use strict';

angular.module('drivers')
  .service('driversService', function(pouchDB, config) {
    var db = pouchDB(config.db);

    this.all = function() {
      return db
        .query('drivers/drivers', {
          /*eslint-disable camelcase*/
          include_docs: true
          /*eslint-enable camelcase*/
        })
        .then(function(response) {
          var drivers = {};
          response.rows.forEach(function(row) {
            drivers[row.key] = row.doc;
          });

          return drivers;
        });
    };
  });
