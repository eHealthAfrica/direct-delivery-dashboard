'use strict';

angular.module('lmisApp')
  .factory('ccuBreakdown', function($q, couchdb, CCEI, Facility) {
    var dbName = 'ccu_breakdown';

    return {
      /**
       * Read data from db ordered by date and arrange it in an array. Every item has the following structure:
       *
       * {
       *   "name": string,
       *   "created": date,
       *   "facility": object
       * }
       *
       */
      byDate: function(options) {
        options = options || {};

        var limit = options.limit;
        var descending = options.descending !== undefined ? !!options.descending : true;

        var params = { _db: dbName, _param: 'ccu_breakdown', _sub_param: 'by_date', descending: descending };
        if (limit !== undefined && !isNaN(limit))
          params.limit = parseInt(limit);

        var d = $q.defer();
        $q.all([
            couchdb.view(params).$promise,
            CCEI.all(),
            Facility.all()
          ])
          .then(function(response) {
            var rows = response[0].rows;
            var cceis = response[1];
            var facilities = response[2];
            d.resolve(rows.map(function(row) {
              var modelId = row.value.ccuProfile.dhis2_modelid;
              var name = modelId !== undefined ? cceis[modelId] : undefined;
              if (name === undefined)
                name = '** Unknown (' + modelId + ') **';

              return {
                name: name,
                created: row.value.created,
                facility: facilities[row.value.facility]
              };
            }));
          })
          .catch(function(error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
