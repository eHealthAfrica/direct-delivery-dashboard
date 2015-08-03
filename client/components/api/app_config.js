'use strict';

angular.module('lmisApp')
  .factory('AppConfig', function($rootScope, $http, $q) {
    var URL = '/api/app_config';

    return {
      all: function() {
        var d = $q.defer();

        $http.get(URL)
          .success(function(data) {
            d.resolve(data);
          })
          .error(function(err) {
            console.log(err);
            d.reject(err);
          });

        return d.promise;
      },
      get: function(id) {
        var d = $q.defer();
        $http.get([URL, id].join('/'))
          .success(function(data) {
            d.resolve(data);
          })
          .error(function(err) {
            console.log(err);
            d.reject(err);
          });

        return d.promise;
      },
      put: function(id, appData) {
        var d = $q.defer();
        $http.put([URL, id].join('/'), appData)
          .success(function(data) {
            d.resolve(data);
          })
          .error(function(err) {
            console.log(err);
            d.reject(err);
          });

        return d.promise;
      }
    };
  });
