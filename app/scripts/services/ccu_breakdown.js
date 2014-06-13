'use strict';

angular.module('lmisApp')
  .factory('ccuBreakdownDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'ccu_breakdown');
  })
  .factory('ccuBreakdown', function ($q, ccuBreakdownDB, CCEI, Facility) {
    return {
      /**
       * Read data from db and arrange it in an array. Every item has the following structure:
       *
       * {
       *   "name": string,
       *   "created": date,
       *   "facility": object
       * }
       *
       */
      all: function () {
        var d = $q.defer();
        $q.all([
            ccuBreakdownDB.query({map: '(' + map.toString() + ')'}, {include_docs: false}),
            CCEI.all(),
            Facility.all()
          ])
          .then(function (response) {
            var rows = response[0].rows;
            var cceis = response[1];
            var facilities = response[2];
            d.resolve(rows.map(function (row) {
              return {
                name: row.value.ccu ? cceis[row.value.ccu] : undefined,
                created: row.value.created,
                facility: row.value.facility ? facilities[row.value.facility] : undefined
              };
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
        ccu: doc.ccuProfile ? doc.ccuProfile.dhis2_modelid : undefined,
        created: doc.created,
        facility: doc.facility ? doc.facility.uuid : undefined
      })
    }
  });
