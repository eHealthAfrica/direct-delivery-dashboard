'use strict';

angular.module('lmisApp')
  .factory('stockcountDB', function surveyDB(pouchdb) {
    return pouchdb.create('http://dev.lomis.ehealth.org.ng:5984/stockcount');
  })
  .factory('stockcountUnopened', function stockcountUnopened($q, stockcountDB, inventoryRulesFactory) {
    function query(group_level, descending) {
      var options = {
        reduce: true,
        group: group_level ? true : false,
        descending: !!descending
      };

      if (group_level)
        options.group_level = group_level;

      return stockcountDB.query('stockcount/unopened', options);
    }

    function addInventoryRules(rows) {
      rows.forEach(function (row) {
        var products = Object.keys(row.products).map(function (key) {
          return row.products[key];
        });

        inventoryRulesFactory.bufferStock(products).forEach(function (product) {
          inventoryRulesFactory.reorderPoint(product);
        });
      });

      return rows;
    }

    return {
      /**
       * Read data from stockcount/unopened db view and arrange it by facility and date. Every item
       * has a facility name, a date and a hash of product -> count.
       */
      byFacilityAndDate: function () {
        var d = $q.defer();
        query(3, true)
          .then(function (response) {
            var items = {};
            response.rows.forEach(function (row) {
              var key = row.key[0] + row.key[1];
              items[key] = items[key] || {
                facility: row.key[0],
                date: new Date(row.key[1]),
                products: {}
              };
              items[key].products[row.key[2]] = { count: row.value };
            });

            d.resolve(addInventoryRules(Object.keys(items).map(function (key) {
              return items[key];
            })));
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
