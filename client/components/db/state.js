'use strict';

angular.module('lmisApp')
  .factory('State', function($rootScope, $http, $q) {
    var URL = '/api/states';
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
            var states = {};
            data.forEach(function(state) {
              states[state._id] = state.name;
              if (names.indexOf(state.name) < 0)
                names.push(state.name);
            });

            names.sort();
            d.resolve(states);
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
