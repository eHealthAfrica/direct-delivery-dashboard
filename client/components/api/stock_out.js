'use strict';

angular.module('lmisApp')
  .factory('stockOut', function($http, $q, utility, ProductType, Facility) {
    var URL = '/api/stock_out';

    return {
      /**
       * Read data from db ordered by date and arrange it in an array. Every item has the following structure:
       *
       * {
       *   "facility": string,
       *   "created": date,
       *   "productType": string,
       *   "stockLevel": number
       * }
       *
       */
      byDate: function(options) {
        var d = $q.defer();

        $q.all([
            utility.request(URL + '/by_date', options),
            ProductType.all(),
            Facility.all()
          ])
          .then(function(response) {
            var rows = response[0];
            var productTypes = response[1];
            var facilities = response[2];
            d.resolve(rows.map(function(row) {
              var productType = productTypes[row.productType];
              return {
                facility: facilities[row.facility],
                created: row.created,
                productType: productType ? productType.code : undefined,
                stockLevel: row.stockLevel
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
