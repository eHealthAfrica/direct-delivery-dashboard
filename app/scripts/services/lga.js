'use strict';

angular.module('lmisApp')
  .factory('lgaDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'lga');
  })
  .factory('LGA', function ($q, lgaDB) {
    var allPromise = null;
    var names = [];

    return {
      /**
       * Read data from db and arrange it as a hash of id -> name
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        names = [];

        lgaDB.allDocs({include_docs: true})
          .then(function (response) {
            var lgas = {};
            response.rows.forEach(function (row) {
              lgas[row.id] = row.doc.name;
              if (names.indexOf(row.doc.name) < 0)
                names.push(row.doc.name);
            });

            names.sort();
            d.resolve(lgas);
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        return allPromise;
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
