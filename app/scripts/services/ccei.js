'use strict';

angular.module('lmisApp')
  .factory('cceiDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'ccei');
  })
  .factory('CCEI', function ($q, cceiDB) {
    var allPromise = null;
    var names = [];

    return {
      /**
       * Read data from db and arrange it as a hash of dhis2_modelid -> name
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        names = [];

        cceiDB.allDocs({include_docs: true})
          .then(function (response) {
            var cceis = {};
            response.rows.forEach(function (row) {
              cceis[row.doc.dhis2_modelid] = row.doc.name;
              if (row.doc.name && names.indexOf(row.doc.name) < 0)
                names.push(row.doc.name);
            });

            names.sort();
            d.resolve(cceis);
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
