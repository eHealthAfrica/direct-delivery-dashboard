'use strict';

angular.module('lmisApp')
  .factory('facilityDB', function surveyDB(pouchdb) {
    return pouchdb.create('http://dev.lomis.ehealth.org.ng:5984/facility');
  })
  .factory('Facility', function Facility($q, facilityDB) {
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
