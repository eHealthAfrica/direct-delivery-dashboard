'use strict';

angular.module('lmisApp')
  .factory('stockCount', function ($q, couchdb, inventoryRulesFactory, ProductProfile, ProductType, Facility, appConfigFactory, utility) {
    var DB_NAME = 'stockcount',
      DAILY = 1,
      WEEKLY = 7,
      BI_WEEKLY = 14,
      MONTHLY = 30;


    function query(group_level, descending) {
      var options = {
        _db: DB_NAME,
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

    function getAllStockCount() {
      var deferred = $q.defer();

      couchdb.allDocs({_db: DB_NAME}).$promise
        .then(function (stockCount) {
          deferred.resolve(stockCount);
        })
        .catch(function (reason) {
          deferred.reject(reason);
        });
      return deferred.promise;
    }

    function getStockCountWithFacilitiesAndAppConfig() {
      var promises = [
        Facility.all(),
        getAllStockCount(),
        appConfigFactory.all()
      ];

      return $q.all(promises);
    }

    function groupByFacility(stockCount) {
      var groupedStockCount = {};

      for (var i = 0; i < stockCount.length; i++) {
        if (groupedStockCount.hasOwnProperty(stockCount[i].doc.facility)) {
          groupedStockCount[stockCount[i].doc.facility].push(stockCount[i]);
        } else {
          groupedStockCount[stockCount[i].doc.facility] = [];
          groupedStockCount[stockCount[i].doc.facility].push(stockCount[i]);
        }
      }
      return groupedStockCount;
    }

    function getSortedStockCount(stockCountList) {
      return stockCountList
        .sort(function (a, b) {
          if (new Date(a.doc.created).getTime() > new Date(b.doc.created).getTime()) {
            return -1;
          }
          if (new Date(a.doc.created).getTime() < new Date(b.doc.created).getTime()) {
            return 1;
          }
          return 0;
        });
    }

    function getDaysFromLastCountDate(lastCountDate) {
      if (Object.prototype.toString.call(lastCountDate) !== '[object Date]') {
        throw "value provided is not a date object";
      }
      var one_day = 1000 * 60 * 60 * 24;
      var difference_ms = new Date().getTime() - lastCountDate.getTime();

      return Math.round(difference_ms / one_day);
    }

    function getStockCountDueDate(interval, reminderDay, date) {
      var today = new Date();
      var currentDate = date || today;
      var countDate;
      interval = parseInt(interval);

      switch (interval) {
        case DAILY:
          countDate = new Date(utility.getFullDate(currentDate));
          break;
        case WEEKLY:
          countDate = utility.getWeekRangeByDate(currentDate, reminderDay).reminderDate;
          if (currentDate.getTime() < countDate.getTime()) {
            //current week count date is not yet due, return previous week count date..
            countDate = new Date(countDate.getFullYear(), countDate.getMonth(), countDate.getDate() - interval);
          }
          break;
        case BI_WEEKLY:
          countDate = utility.getWeekRangeByDate(currentDate, reminderDay).reminderDate;
          if (currentDate.getTime() < countDate.getTime()) {
            //current week count date is not yet due, return last bi-weekly count date
            countDate = new Date(countDate.getFullYear(), countDate.getMonth(), countDate.getDate() - interval);
          }
          break;
        case MONTHLY:
          var monthlyDate = (currentDate.getTime() === today.getTime()) ? 1 : currentDate.getDate();
          countDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), monthlyDate);
          break;
        default:
          countDate = utility.getWeekRangeByDate(currentDate, reminderDay).reminderDate;
          if (currentDate.getTime() < countDate.getTime()) {
            //current week count date is not yet due, return previous week count date..
            countDate = new Date(countDate.getFullYear(), countDate.getMonth(), countDate.getDate() - interval);
          }
      }
      return countDate
    }

    var hasPendingStockCount = function (lastCountDueDate, currentDueDate) {
      return !(lastCountDueDate.getTime() === currentDueDate.getTime());
    };

    function stockCountSummaryByFacility() {

      var deferred = $q.defer();

      getStockCountWithFacilitiesAndAppConfig()
        .then(function (resolved) {
          var facilities = resolved[0],
            stockCount = resolved[1].rows,
            appConfig = utility.castArrayToObject(resolved[2].rows, 'id');

          var groupedStockCount = groupByFacility(stockCount);
          var summaryHeader = [];

          for (var key in groupedStockCount) {
            var sortedStockCount = getSortedStockCount(groupedStockCount[key]);
            var latestStockCount = sortedStockCount[0];
            var previousStockCount = sortedStockCount[1] ? sortedStockCount[1] : null;

            if (angular.isDefined(facilities[key])) {

              var facilityConfig = appConfig[facilities[key].email];
              if (angular.isDefined(facilityConfig)) {
                var currentDueDate = getStockCountDueDate(facilityConfig.value.facility.stockCountInterval, facilityConfig.value.facility.reminderDay);
                var nextCountDate = currentDueDate.getTime() + new Date(1000 * 60 * 60 * 24 * facilityConfig.value.facility.stockCountInterval).getTime();
                var daysFromLastCount = getDaysFromLastCountDate(new Date(latestStockCount.doc.countDate));

                summaryHeader.push({
                  facility: facilityConfig.value.facility.name,
                  createdDate: latestStockCount.doc.created,
                  facilityUUID: key,
                  reminderDay: utility.getWeekDay(facilityConfig.value.facility.reminderDay),
                  previousCountDate: previousStockCount !== null ? previousStockCount.doc.countDate : 'None',
                  previousCreatedDate: previousStockCount !== null ? previousStockCount.doc.created : 'None',
                  currentDueDate: currentDueDate,
                  mostRecentCountDate: latestStockCount.doc.countDate,
                  nextCountDate: nextCountDate,
                  stockCountInterval: facilityConfig.value.facility.stockCountInterval,
                  completedCounts: groupedStockCount[key].length,
                  hasPendingStockCount: hasPendingStockCount(new Date(latestStockCount.doc.countDate), currentDueDate),
                  daysFromLastCountDate: daysFromLastCount
                });
              }
            }
          }

          deferred.resolve({
            summary: summaryHeader,
            groupedStockCount: groupedStockCount
          });
        })
        .catch(function (reason) {
          deferred.reject(reason);
        });

      return deferred.promise;
    }

    /**
     * Returns only latest rows for each facility ordered by date descending. Uses 'created' date field.
     *
     * @param rows
     */
    function latest(rows) {
      var added = [];

      return rows
        .sort(function (a, b) {
          if (a.created > b.created) return -1;
          if (a.created < b.created) return 1;
          return 0;
        })
        .filter(function (row) {
          var uuid = (row.facility && row.facility.uuid) || undefined;
          if (uuid && uuid != Facility.unknown.uuid && added.indexOf(uuid) < 0) {
            added.push(uuid);
            return true;
          }
          else
            return false;
        });
    }

    /**
     * Resolves the product types of the 'unopened' property of each row and replaces it with
     * an array of objects of the following structure:
     *
     * {
     *   "productType": object,
     *   "count": number
     * }
     */
    function resolveUnopened(rows) {
      var d = $q.defer();

      $q.all([
          ProductProfile.all(),
          ProductType.all()
        ])
        .then(function (response) {
          var productProfiles = response[0];
          var productTypes = response[1];

          rows.forEach(function (row) {
            if (row.unopened) {
              var unopened = {};
              Object.keys(row.unopened).forEach(function (key) {
                var productProfile = productProfiles[key];
                var productType = ((productProfile && productProfile.product) ? productTypes[productProfile.product] : undefined) || ProductType.unknown;

                unopened[productType.uuid] = unopened[productType.uuid] || {
                  productType: productType || ProductType.unknown,
                  count: 0
                };

                unopened[productType.uuid].count += row.unopened[key];
              });

              row.unopened = Object.keys(unopened).map(function (key) {
                return unopened[key];
              });
            }
          });

          d.resolve(rows);
        })
        .catch(function (error) {
          console.log(error);
          d.reject(error);
        });

      return d.promise;
    }

    return {
      /**
       * Returns all records with the facilities resolved to the corresponding objects from the facilities db and sorted
       * by the 'created' property in descending order.
       */
      all: function () {
        var d = $q.defer();
        $q.all([
            couchdb.allDocs({_db: DB_NAME}).$promise,
            Facility.all()
          ])
          .then(function (response) {
            var rows = response[0].rows
              .map(function (row) {
                return row.doc;
              })
              .filter(utility.isNotDesignDoc);

            var facilities = response[1];

            rows.forEach(function (row) {
              row.facility = (row.facility ? facilities[row.facility] : undefined) || Facility.unknown;
              ['created', 'modified', 'countDate', 'dateSynced'].forEach(function (date) {
                if (row[date])
                  row[date] = moment(row[date]).toDate();
              });
            });

            d.resolve(rows);
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
        $q.all([
            query(3, true),
            Facility.all()
          ])
          .then(function (response) {
            var queryRows = response[0].rows;
            var facilities = response[1];

            var items = {};
            queryRows.forEach(function (row) {
              var key = row.key[0] + row.key[1];
              items[key] = items[key] || {
                facility: facilities[row.key[0]] || undefined,
                date: new Date(row.key[1]),
                products: {}
              };
              items[key].products[row.key[2]] = { count: row.value };
            });

            var rows = Object.keys(items)
              .map(function (key) {
                return items[key];
              })
              .sort(function (a, b) {
                if (a.date > b.date) return -1;
                if (a.date < b.date) return 1;
                return 0;
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
      },
      groupByFacility: groupByFacility,
      stockCountSummaryByFacility: stockCountSummaryByFacility,
      getStockCountDueDate: getStockCountDueDate,
      getDaysFromLastCountDate: getDaysFromLastCountDate,
      getSortedStockCount: getSortedStockCount,
      hasPendingStockCount: hasPendingStockCount,
      resolveUnopened: resolveUnopened,
      latest: latest
    };
  });
