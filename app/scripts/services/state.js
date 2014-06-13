'use strict';

angular.module('lmisApp')
  .factory('stateDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'state');
  })
  .factory('State', function ($q, stateDB) {
    var allPromise = null;

    return {
      /**
       * Read data from db and arrange it as a hash of id -> name
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        stateDB.allDocs({include_docs: true})
          .then(function (response) {
            var states = {};
            response.rows.forEach(function (row) {
              states[row.id] = row.doc.name;
            });
            d.resolve(states);
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
