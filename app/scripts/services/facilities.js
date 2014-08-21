'use strict';

angular.module('lmisApp')
  .factory('Facility', function ($rootScope, $q, couchdb, utility) {
    var DB_NAME = 'facilities';
    var allPromise = null;
    var names = [];

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    return {
      /**
       * Represents a unknown facility. Used for facility uuids not in the db.
       */
      unknown: {
        uuid: '_unknown_',
        name: '** Unknown **',
        state: '** Unknown **',
        zone: '** Unknown **',
        lga: '** Unknown **',
        ward: '** Unknown **'
      },

      /**
       * Read data from db and arrange it as a hash of uuid -> facility
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        names = [];

        couchdb.allDocs({_db: DB_NAME}).$promise
          .then(function (response) {
            var facilities = {};
            response.rows.forEach(function (row) {
              facilities[row.doc.uuid] = row.doc;
              if (names.indexOf(row.doc.name) < 0)
                names.push(row.doc.name);
            });

            names.sort();
            d.resolve(facilities);
          })
          .catch(function (error) {
            console.log(error);
            allPromise = null;
            d.reject(error);
          });

        return d.promise;
      },
      /**
       * Returns data as array of names.
       */
      names: function (filter, reload) {
        var d = $q.defer();
        var pattern = (filter && filter.length) ? new RegExp(filter, 'i') : null;
        this.all(reload)
          .then(function () {
            d.resolve(pattern ? names.filter(function (name) {
              return pattern.test(name);
            }) : names);
          })
          .catch(function (error) {
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
