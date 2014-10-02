'use strict';

angular.module('lmisApp')
  .factory('UomFactory', function($rootScope, $http, $q) {
    var URL = '/api/uoms';
    var allPromise = null;

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    return {
      /**
       * Read data from db and arrange it as a hash of id -> product profile
       */
      all: function(reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;

        $http.get(URL)
          .success(function(data) {
            var uoms = {};
            data.forEach(function(uom) {
              uoms[uom._id] = uom;
            });

            d.resolve(uoms);
          })
          .error(function(err) {
            console.log(err);
            allPromise = null;
            d.reject(err);
          });

        return d.promise;
      }
    }
  });
