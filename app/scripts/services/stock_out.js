'use strict';

angular.module('lmisApp')
  .factory('stockOutDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'stock_out');
  })
  .factory('stockOut', function ($q, stockOutDB, ProductType, Facility) {
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
            stockOutDB.query({map: '(' + map.toString() + ')'}, {include_docs: false}),
            ProductType.all(),
            Facility.all()
          ])
          .then(function (response) {
            var rows = response[0].rows;
            var productTypes = response[1];
            var facilities = response[2];
            d.resolve(rows.map(function (row) {
              var productType = row.value.productType ? productTypes[row.value.productType] : undefined;
              return {
                facility: row.value.facility ? facilities[row.value.facility] : undefined,
                created: row.value.created,
                productType: productType ? productType.name : undefined,
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

    /**
     * Simple map function for selecting only required fields.
     */
    function map(doc) {
      emit(doc._id, {
        facility: doc.facility ? doc.facility.uuid : undefined,
        created: doc.created,
        productType: doc.productType ? (doc.productType.uuid || doc.productType) : undefined,
        stockLevel: doc.stockLevel
      })
    }
  });
