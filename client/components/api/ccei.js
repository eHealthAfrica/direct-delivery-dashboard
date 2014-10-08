'use strict';

angular.module('lmisApp')
  .factory('CCEI', function($rootScope, $http, $q) {
    var URL = '/api/cceis';
    var allPromise = null;
    var names = [];

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    return {
      /**
       * Read data from db and arrange it as a hash of dhis2_modelid -> model name
       */
      all: function(reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        names = [];

        $http.get(URL)
          .success(function(data) {
            var cceis = {};
            data.forEach(function(ccei) {
              var name = (ccei.Manufacturer && ccei.ModelName) ? (ccei.Manufacturer + ' - ' + ccei.ModelName) : undefined;
              if (ccei.dhis2_modelid && name) {
                cceis[ccei.dhis2_modelid] = name;
                if (names.indexOf(name) < 0)
                  names.push(name);
              }
            });

            names.sort();
            d.resolve(cceis);
          })
          .error(function(err) {
            console.log(err);
            allPromise = null;
            d.reject(err);
          });

        return d.promise;
      },
      /**
       * Returns data as array of model names.
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
