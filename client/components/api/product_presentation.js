'use strict';

angular.module('lmisApp')
  .factory('ProductPresentation', function($rootScope, $http, $q) {
    var URL = '/api/product_presentations';
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
            var presentations = {};
            data.forEach(function(presentation) {
              presentations[presentation._id] = presentation;
            });

            d.resolve(presentations);
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
