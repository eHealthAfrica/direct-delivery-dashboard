'use strict';

angular.module('lmisApp')
  .factory('stockcountUnopened', function ($q, couchdb, inventoryRulesFactory, ProductProfile, ProductType, Facility) {
    var dbName = 'stockcount';

    function query(group_level, descending) {
      var options = {
        _db: dbName,
        _param: 'stockcount',
        _sub_param: 'unopened',
        reduce: true,
        group: group_level ? true : false,
        descending: !!descending
      };

      if (group_level)
        options.group_level = group_level;

      return couchdb.view(options).$promise;
    }

    function groupByProductType(rows) {
      var d = $q.defer();
      ProductProfile.all()
        .then(function (profiles) {
          rows.forEach(function (row) {
            var rowProducts = {};
            Object.keys(row.products).forEach(function (key) {
              var product = row.products[key];
              var profile = profiles[key];
              if (profile && profile.product) {
                rowProducts[profile.product] = rowProducts[profile.product] || { count: 0 };
                rowProducts[profile.product].count += product.count;
              }
            });

            row.products = rowProducts;
          });

          d.resolve(rows);
        })
        .catch(function (error) {
          console.log(error);
          d.reject(error);
        });

      return d.promise;
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
       * Read all documents from db, expand them on unopened products and arrange them in an array
       * with facilities resolved to their names and product types to their codes. Every item has the
       * following structure:
       * {
       *   "facility": string,
       *   "created": date,
       *   "productType": string,
       *   "count": number,
       * }
       */
      all: function () {
        var d = $q.defer();
        $q.all([
            couchdb.allDocs({_db: dbName}).$promise,
            ProductProfile.all(),
            ProductType.all(),
            Facility.all()
          ])
          .then(function (response) {
            var rows = response[0].rows;
            var productProfiles = response[1];
            var productTypes = response[2];
            var facilities = response[3];

            var expanded = [];
            rows.forEach(function (row) {
              if (row.doc.unopened) {
                Object.keys(row.doc.unopened).forEach(function (productProfileUUID) {
                  var productProfile = productProfiles[productProfileUUID];
                  var productType = (productProfile && productProfile.product) ? productTypes[productProfile.product] : undefined;

                  expanded.push({
                    facility: row.doc.facility ? facilities[row.doc.facility] : undefined,
                    created: row.doc.created,
                    modified: row.doc.modified,
                    productType: productType ? productType.code : undefined,
                    count: row.doc.unopened[productProfileUUID]
                  });
                });
              }
            });

            d.resolve(expanded);
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      },
      /**
       * Read data from stockcount/unopened db view and arrange it by facility and date. Every item
       * has a facility name, a date and a hash of productType -> count.
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

            var rows = Object.keys(items).map(function (key) {
              return items[key];
            });

            groupByProductType(rows)
              .then(function (rows) {
                d.resolve(addInventoryRules(rows));
              })
              .catch(function (error) {
                console.log(error);
                d.reject(error);
              });
          })
          .catch(function (error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      }
    };
  });
