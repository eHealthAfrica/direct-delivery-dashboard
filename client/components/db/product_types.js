'use strict';

angular.module('lmisApp')
  .factory('ProductType', function($rootScope, $http, $q) {
    var URL = '/api/product_types';
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
       * Read data from db and arrange it as a hash of uuid -> product type
       */
      all: function(reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        codes = [];

        $http.get(URL)
          .success(function(data) {
            var types = {};
            data.forEach(function(type) {
              types[type._id] = type;
              if (type.code && codes.indexOf(type.code) < 0)
                codes.push(type.code);
            });

            codes.sort();
            d.resolve(types);
          })
          .error(function(err) {
            console.log(err);
            allPromise = null;
            d.reject(err);
          });

        return d.promise;
      },
      /**
       * Returns data as array of codes.
       */
      codes: function(filter, reload) {
        var d = $q.defer();
        var pattern = (filter && filter.length) ? new RegExp(filter, 'i') : null;
        this.all(reload)
          .then(function() {
            d.resolve(pattern ? codes.filter(function(code) {
              return pattern.test(code);
            }) : codes);
          })
          .catch(function(error) {
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
