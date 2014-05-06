'use strict';

angular.module('lmisApp')
  .factory('stockcountDB', function surveyDB(pouchdb) {
    return pouchdb.create('http://dev.lomis.ehealth.org.ng:5984/stockcount');
  })
  .factory('stockcountUnopened', function stockcountUnopened($q, stockcountDB) {
    function query(group_level) {
      var options = {
        reduce: true,
        group: group_level ? true : false
      };

      if (group_level)
        options.group_level = group_level;

      return stockcountDB.query('stockcount/unopened', options);
    }

    return {
      /**
       * Read data from stockcount/unopened db view and arrange it by facility and date. Every item
       * has a facility name, a date and a hash of product -> count.
       */
      byFacilityAndDate: function () {
        var d = $q.defer();
        query(3)
          .then(function (response) {
            var rows = [];
            var items = {};
            response.rows.forEach(function (row) {
              var key = row.key[0] + row.key[1];
              items[key] = items[key] || {
                facility: row.key[0],
                date: row.key[1],
                products: {}
              };
              items[key].products[row.key[2]] = row.value;
            });

            for (var key in items)
              rows.push(items[key]);

            d.resolve(rows)
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
