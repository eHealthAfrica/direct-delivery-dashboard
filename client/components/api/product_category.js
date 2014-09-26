'use strict';

angular.module('lmisApp')
  .factory('ProductCategory', function($rootScope, $http, $q) {
    var URL = '/api/product_categories';
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
        _id: '_unknown_',
        uuid: '_unknown_',
        code: '** Unknown **'
      },

      /**
       * Read data from db and arrange it as a hash of id -> product type
       */
      all: function(reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        codes = [];

        $http.get(URL)
          .success(function(data) {
            var categories = {};
            data.forEach(function(category) {
              categories[category._id] = category;
              if (category.code && codes.indexOf(category.code) < 0)
                codes.push(category.code);
            });

            codes.sort();
            d.resolve(categories);
          })
          .error(function(err) {
            console.log(err);
            allPromise = null;
            d.reject(err);
          });

        return d.promise;
      },
      /**
       * Returns css style of a given product category.
       */
      getStyle: function(categoryName) {
        if (!angular.isString(categoryName)) {
          return '';
        }
        return categoryName.split(' ').join('-').toLowerCase();
      }
    };
  });
