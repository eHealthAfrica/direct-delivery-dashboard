'use strict';

angular.module('lmisApp')
  .factory('ProductProfile', function($rootScope, $http, $q) {
    var URL = '/api/product_profiles';
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
            var profiles = {};
            data.forEach(function(profile) {
              profiles[profile._id] = profile;
            });

            d.resolve(profiles);
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
