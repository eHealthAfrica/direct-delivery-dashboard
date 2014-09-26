'use strict';

angular.module('lmisApp')
  .factory('Ward', function($rootScope, $http, $q) {
    var URL = '/api/wards';
    var allPromise = null;
    var names = [];

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    return {
      /**
       * Read data from db and arrange it as a hash of id -> name
       */
      all: function(reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        names = [];

        $http.get(URL)
          .success(function(data) {
            var wards = {};
            data.forEach(function(ward) {
              wards[ward.uuid] = ward.name;
              if (names.indexOf(ward.name) < 0)
                names.push(ward.name);
            });

            names.sort();
            d.resolve(wards);
          })
          .error(function(err) {
            console.log(err);
            allPromise = null;
            d.reject(err);
          });

        return d.promise;
      },
      /**
       * Returns data as array of names.
       */
      names: function(filter, reload) {
        var d = $q.defer();
        var pattern = (filter && filter.length) ? new RegExp(filter, 'i') : null;
        this.all(reload)
          .then(function() {
            d.resolve(pattern ? names.filter(function(name) {
              return pattern.test(name);
            }) : names);
          })
          .catch(function(error) {
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
