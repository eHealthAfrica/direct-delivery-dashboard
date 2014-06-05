'use strict';

angular.module('lmisApp')
  .factory('ProductType', function ($q, $http) {
    var allPromise = null;

    return {
      /**
       * Read data from product types fixture file
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        $http.get('fixtures/product_types.json')
          .success(function (data) {
            d.resolve(data);
          })
          .error(function (err) {
            console.log(err);
            d.resolve({});
          });

        allPromise = d.promise;
        return allPromise;
      }
    };
  });
