'use strict';

angular.module('lmisApp')
  .factory('ProductPresentation', function ($rootScope, $q, couchdb) {
    var dbName = 'product_presentation';
    var allPromise = null;

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    return {
      /**
       * Read data from db and arrange it as a hash of uuid -> product profile
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;

        couchdb.allDocs({_db: dbName}).$promise
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
