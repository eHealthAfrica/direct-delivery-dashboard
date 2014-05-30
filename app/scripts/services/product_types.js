'use strict';

angular.module('lmisApp')
  .factory('ProductType', function Facility($q, $http) {
    return {
      /**
       * Read data from product types fixture file
       */
      all: function () {
        var d = $q.defer();

        $http.get('fixtures/product_types.json')
          .success(function(data) {
            d.resolve(data);
          })
          .error(function(err) {
            console.log(err);
            d.resolve({});
          });

        return d.promise;
      }
    };
  });
