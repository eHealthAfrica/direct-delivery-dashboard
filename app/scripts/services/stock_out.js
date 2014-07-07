'use strict';

angular.module('lmisApp')
  .factory('stockOut', function ($q, couchdb, ProductType, Facility) {
    var dbName = 'stock_out';

    return {
      /**
       * Read data from db and arrange it in an array. Every item has the following structure:
       *
       * {
       *   "facility": string,
       *   "created": date,
       *   "productType": string,
       *   "stockLevel": number
       * }
       *
       */
      all: function () {
        var d = $q.defer();
        $q.all([
            couchdb.allDocs({_db: dbName}).$promise,
            ProductType.all(),
            Facility.all()
          ])
          .then(function (response) {
            var rows = response[0].rows;
            var productTypes = response[1];
            var facilities = response[2];
            d.resolve(rows.map(function (row) {
              var productType = row.doc.productType ? productTypes[row.doc.productType.uuid || row.doc.productType] : undefined;
              return {
                facility: row.doc.facility ? facilities[row.doc.facility.uuid] : undefined,
                created: row.doc.created,
                productType: productType ? productType.code : undefined,
                stockLevel: row.doc.stockLevel
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
