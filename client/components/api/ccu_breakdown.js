'use strict';

angular.module('lmisApp')
  .factory('ccuBreakdown', function($http, $q, utility, CCEI, Facility) {
    var URL = '/api/ccu_breakdown';

    function all(reload) {
      var deferred = $q.defer();

      $http.get(URL+'/all')
        .success(function (response) {
          deferred.resolve(response);
        })
        .error(function (error) {
          console.log(error);
          deferred.reject(error);
        });

      return deferred.promise;
    }

    return {
      all: all,
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
        var d = $q.defer();

        $q.all([
            utility.request(URL + '/by_date', options),
            CCEI.all(),
            Facility.all()
          ])
          .then(function(response) {
            var rows = response[0];
            var cceis = response[1];
            var facilities = response[2];

            d.resolve(rows.map(function(row) {
              var modelId = row.ccuProfile.dhis2_modelid;
              var name = modelId !== undefined ? cceis[modelId] : undefined;
              if (name === undefined)
                name = '** Unknown (' + modelId + ') **';

              return {
                name: name,
                created: row.created,
                facility: facilities[row.facility]
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
