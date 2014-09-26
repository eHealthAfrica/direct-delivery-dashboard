'use strict';

angular.module('lmisApp')
  .factory('Facility', function($rootScope, $http, $q) {
    var URL = '/api/facilities';
    var allPromise = null;
    var names = [];

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    return {
      /**
       * Represents a unknown facility. Used for facility ids not in the db.
       */
      unknown: {
        _id: '_unknown_',
        uuid: '_unknown_',
        name: '** Unknown **',
        state: '** Unknown **',
        zone: '** Unknown **',
        lga: '** Unknown **',
        ward: '** Unknown **'
      },

      /**
       * Read data from db and arrange it as a hash of id -> facility
       */
      all: function(reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        names = [];

        $http.get(URL)
          .success(function(data) {
            var facilities = {};
            data.forEach(function(facility) {
              facilities[facility._id] = facility;
              if (names.indexOf(facility.name) < 0)
                names.push(facility.name);
            });

            names.sort();
            d.resolve(facilities);
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
