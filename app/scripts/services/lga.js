'use strict';

angular.module('lmisApp')
  .factory('lgaDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'lga');
  })
  .factory('LGA', function ($q, lgaDB) {
    var allPromise = null;

    return {
      /**
       * Read data from db and arrange it as a hash of id -> name
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        lgaDB.allDocs({include_docs: true})
          .then(function (response) {
            var lgas = {};
            response.rows.forEach(function (row) {
              lgas[row.id] = row.doc.name;
            });
            d.resolve(lgas);
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
