'use strict';

angular.module('lmisApp')
  .factory('cceiDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'ccei');
  })
  .factory('CCEI', function ($q, cceiDB) {
    return {
      /**
       * Read data from facility db and arrange it as a hash of dhis2_modelid -> name
       */
      all: function () {
        var d = $q.defer();
        cceiDB.allDocs({include_docs: true})
          .then(function (response) {
            var cceis = {};
            response.rows.forEach(function (row) {
              cceis[row.doc.dhis2_modelid] = row.doc.name;
            });
            d.resolve(cceis);
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
