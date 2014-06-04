'use strict';

angular.module('lmisApp')
  .factory('stockOutDB', function surveyDB(pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'stock_out');
  })
  .factory('stockOut', function Facility($q, stockOutDB) {
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
        stockOutDB.query({map: '(' + map.toString() + ')'}, {include_docs: false})
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
        facility: doc.facility ? doc.facility.name : '',
        created: doc.created,
        productType: doc.productType ? doc.productType.name : '',
        stockLevel: doc.stockLevel
      })
    }
  });
