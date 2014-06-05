'use strict';

angular.module('lmisApp')
  .factory('productProfilesDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'product_profiles');
  })
  .factory('ProductProfile', function ($q, productProfilesDB) {
    return {
      /**
       * Read data from product_profiles db and arrange it as a hash of uuid -> product profile
       */
      all: function () {
        var d = $q.defer();
        productProfilesDB.allDocs({include_docs: true})
          .then(function (response) {
            var products = {};
            response.rows.forEach(function (row) {
              products[row.doc.uuid] = row.doc;
            });
            d.resolve(products);
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      }
    }
  });
