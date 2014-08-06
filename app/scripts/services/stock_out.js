'use strict';

angular.module('lmisApp')
  .factory('stockOut', function ($q, couchdb, ProductType, Facility) {
    var dbName = 'stock_out';

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
      byDate: function (options) {
        options = options || {};

        var limit = options.limit;
        var descending = options.descending !== undefined ? !!options.descending : true;

        var params = { _db: dbName, _param: 'stock_out', _sub_param: 'by_date', descending: descending };
        if (limit !== undefined && !isNaN(limit))
          params.limit = parseInt(limit);

        var d = $q.defer();
        $q.all([
            couchdb.view(params).$promise,
            ProductType.all(),
            Facility.all()
          ])
          .then(function (response) {
            var rows = response[0].rows;
            var productTypes = response[1];
            var facilities = response[2];
            d.resolve(rows.map(function (row) {
              var productType = productTypes[row.value.productType];
              return {
                facility: facilities[row.value.facility],
                created: row.value.created,
                productType: productType ? productType.code : undefined,
                stockLevel: row.value.stockLevel
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
