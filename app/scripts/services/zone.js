'use strict';

angular.module('lmisApp')
  .factory('zoneDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'zone');
  })
  .factory('Zone', function ($q, zoneDB) {
    var allPromise = null;

    return {
      /**
       * Read data from db and arrange it as a hash of id -> name
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        zoneDB.allDocs({include_docs: true})
          .then(function (response) {
            var zones = {};
            response.rows.forEach(function (row) {
              zones[row.id] = row.doc.name;
            });
            d.resolve(zones);
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
