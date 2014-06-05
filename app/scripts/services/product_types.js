'use strict';

angular.module('lmisApp')
  .factory('productTypesDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'product_types');
  })
  .factory('ProductType', function ($q, productTypesDB) {
    var allPromise = null;

    return {
      /**
       * Read data from product_types db and arrange it as a hash of uuid -> product type
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        productTypesDB.allDocs({include_docs: true})
          .then(function (response) {
            var types = {};
            response.rows.forEach(function(row) {
              types[row.doc.uuid] = row.doc;
            });
            d.resolve(types);
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        allPromise = d.promise;
        return allPromise;
      }
    };
  });
