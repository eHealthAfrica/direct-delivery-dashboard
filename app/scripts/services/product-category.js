'use strict';

angular.module('lmisApp')
  .factory('ProductCategory', function ($rootScope, $q, couchdb) {
    var dbName = 'product_category';
    var allPromise = null;
    var codes = [];

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    return {
      /**
       * Represents a unknown product type. Used for product type uuids not in the db.
       */
      unknown: {
        uuid: '_unknown_',
        code: '** Unknown **'
      },

      /**
       * Read data from db and arrange it as a hash of uuid -> product type
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        codes = [];

        couchdb.allDocs({_db: dbName}).$promise
          .then(function (response) {
            var types = {};
            response.rows.forEach(function (row) {
              types[row.doc.uuid] = row.doc;
              if (row.doc.code && codes.indexOf(row.doc.code) < 0)
                codes.push(row.doc.code);
            });

            codes.sort();
            d.resolve(types);
          })
          .catch(function (error) {
            console.log(error);
            allPromise = null;
            d.reject(error);
          });

        return d.promise;
      },
      /**
       * Returns css style of a given product category.
       */
      getStyle: function (categoryName) {
        if(!angular.isString(categoryName)){
          return '';
        }
        return categoryName.split(' ').join('-').toLowerCase();
      }
    };
  });
