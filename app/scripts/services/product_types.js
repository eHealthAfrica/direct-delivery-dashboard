'use strict';

angular.module('lmisApp')
  .factory('productTypesDB', function (pouchdb, SETTINGS) {
    return pouchdb.create(SETTINGS.dbUrl + 'product_types');
  })
  .factory('ProductType', function ($q, productTypesDB) {
    var allPromise = null;
    var codes = [];

    return {
      /**
       * Read data from db and arrange it as a hash of uuid -> product type
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        codes = [];

        productTypesDB.allDocs({include_docs: true})
          .then(function (response) {
            var types = {};
            response.rows.forEach(function (row) {
              types[row.doc.uuid] = row.doc;
              if (row.doc.code && codes.indexOf(row.doc.code) < 0)
                codes.push(row.doc.code);
            });

            codes.sort();
            d.resolve(types);
          })
          .catch(function (error) {
            console.log(error);
            allPromise = null;
            d.reject(error);
          });

        return d.promise;
      },
      /**
       * Returns data as array of codes.
       */
      codes: function (filter, reload) {
        var d = $q.defer();
        var pattern = (filter && filter.length) ? new RegExp(filter, 'i') : null;
        this.all(reload)
          .then(function () {
            d.resolve(pattern ? codes.filter(function (code) {
              return pattern.test(code);
            }) : codes);
          })
          .catch(function (error) {
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
