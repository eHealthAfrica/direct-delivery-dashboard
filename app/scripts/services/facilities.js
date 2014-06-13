'use strict';

angular.module('lmisApp')
  .factory('facilityDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'facilities');
  })
  .factory('Facility', function ($q, facilityDB) {
    var allPromise = null;

    return {
      /**
       * Read data from db and arrange it as a hash of uuid -> facility
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        facilityDB.allDocs({include_docs: true})
          .then(function (response) {
            var facilities = {};
            response.rows.forEach(function (row) {
              facilities[row.doc.uuid] = row.doc;
            });
            d.resolve(facilities);
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        allPromise = d.promise;
        return allPromise;
      }
    };
  });
