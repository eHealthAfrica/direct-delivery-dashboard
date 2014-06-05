'use strict';

angular.module('lmisApp')
  .factory('facilityDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'facility');
  })
  .factory('Facility', function ($q, facilityDB) {
    return {
      /**
       * Read data from facility db and arrange it as a hash of uuid -> name
       */
      all: function () {
        var d = $q.defer();
        facilityDB.allDocs({include_docs: true})
          .then(function (response) {
            var facilities = {};
            response.rows.forEach(function (row) {
              facilities[row.doc.uuid] = row.doc.name;
            });
            d.resolve(facilities);
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
