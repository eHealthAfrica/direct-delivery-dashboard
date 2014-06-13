'use strict';

angular.module('lmisApp')
  .factory('wardDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'ward');
  })
  .factory('Ward', function ($q, wardDB) {
    var allPromise = null;

    return {
      /**
       * Read data from db and arrange it as a hash of id -> name
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        wardDB.allDocs({include_docs: true})
          .then(function (response) {
            var wards = {};
            response.rows.forEach(function (row) {
              wards[row.id] = row.doc.name;
            });
            d.resolve(wards);
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
