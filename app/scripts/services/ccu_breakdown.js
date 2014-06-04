'use strict';

angular.module('lmisApp')
  .factory('ccuBreakdownDB', function surveyDB(pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'ccu_breakdown');
  })
  .factory('ccuBreakdown', function Facility($q, ccuBreakdownDB) {
    return {
      /**
       * Read data from db and arrange it in an array. Every item has the following structure:
       *
       * {
       *   "name": string,
       *   "created": date,
       *   "facility": string
       * }
       *
       */
      all: function () {
        var d = $q.defer();
        ccuBreakdownDB.query({map: '(' + map.toString() + ')'}, {include_docs: false})
          .then(function (response) {
            d.resolve(response.rows.map(function(row) {
              return row.value;
            }));
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      }
    };

    /**
     * Simple map function for selecting only required fields.
     */
    function map(doc) {
      emit(doc._id, {
        name: doc.ccuProfile.name,
        created: doc.created,
        facility: doc.facility.name
      })
    }
  });
