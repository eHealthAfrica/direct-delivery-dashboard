'use strict';

angular.module('lmisApp')
  .factory('productProfilesDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'product_profiles');
  })
  .factory('ProductProfile', function ($q, productProfilesDB) {
    var allPromise = null;

    return {
      /**
       * Read data from db and arrange it as a hash of uuid -> product profile
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;

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
            allPromise = null;
            d.reject(error);
          });

        return d.promise;
      }
    }
  });
