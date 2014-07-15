'use strict';

angular.module('lmisApp')
  .factory('ccuBreakdown', function ($q, couchdb, CCEI, Facility) {
    var dbName = 'ccu_breakdown';

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
            couchdb.allDocs({_db: dbName}).$promise,
            CCEI.all(),
            Facility.all()
          ])
          .then(function (response) {
            var rows = response[0].rows;
            var cceis = response[1];
            var facilities = response[2];
            d.resolve(rows.map(function (row) {
              var modelId = (row.doc.ccuProfile && row.doc.ccuProfile.dhis2_modelid !== undefined) ? row.doc.ccuProfile.dhis2_modelid : undefined;
              var name = modelId !== undefined ? cceis[modelId] : undefined;
              if (name === undefined)
                name = '** Unknown (' + modelId + ') **';
              return {
                name: name,
                created: row.doc.created,
                facility: row.doc.facility ? facilities[row.doc.facility.uuid] : undefined
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
  });
