'use strict';

angular.module('lmisApp')
  .factory('stockCount', function($q, $http, InventoryRules, ProductProfile, ProductType, Facility, AppConfig, utility, ProductCategory) {
    var URL = '/api/stock_count',
      DAILY = 1,
      WEEKLY = 7,
      BI_WEEKLY = 14,
      MONTHLY = 30;

    function groupByProductType(rows) {
      var d = $q.defer();
      ProductProfile.all()
        .then(function(profiles) {
          rows.forEach(function(row) {
            var rowProducts = {};
            Object.keys(row.products).forEach(function(key) {
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
        .catch(function(error) {
          console.log(error);
          d.reject(error);
        });

      return d.promise;
    }

    function addInventoryRules(rows) {
      rows.forEach(function(row) {
        var products = Object.keys(row.products).map(function(key) {
          return row.products[key];
        });

        InventoryRules.bufferStock(products).forEach(function(product) {
          InventoryRules.reorderPoint(product);
        });
      });

      return rows;
    }

    function getStockCountWithFacilitiesAndAppConfig() {
      var startDate, endDate;
      if(arguments.length > 0 && arguments[0]){
        startDate = arguments[0].date || arguments[0]; // to handle both objects containing dates and date objects
        if(arguments[1]){
          endDate = arguments[1].date || arguments[1];
        }
        URL += '/in_range?start='+startDate+'&end='+endDate
      }
      var hasWorkingPhone = true;
      var promises = [
        Facility.all(),
        utility.request(URL),
        AppConfig.byPhoneStatus(hasWorkingPhone)
      ];

      return $q.all(promises);
    }

    function groupByFacility(stockCount) {
      var groupedStockCount = {};

      for (var i = 0; i < stockCount.length; i++) {
        if (groupedStockCount.hasOwnProperty(stockCount[i].facility)) {
          groupedStockCount[stockCount[i].facility].push(stockCount[i]);
        }
        else {
          groupedStockCount[stockCount[i].facility] = [];
          groupedStockCount[stockCount[i].facility].push(stockCount[i]);
        }
      }
      return groupedStockCount;
    }

    function getSortedStockCount(stockCountList) {
      return stockCountList
        .sort(function(a, b) {
          if (new Date(a.created).getTime() > new Date(b.created).getTime()) {
            return -1;
          }
          if (new Date(a.created).getTime() < new Date(b.created).getTime()) {
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

    var hasPendingStockCount = function(lastCountDueDate, currentDueDate) {
      return !(lastCountDueDate.getTime() === currentDueDate.getTime());
    };

    function stockCountSummaryByFacility() {

      var deferred = $q.defer();
      var startDate, endDate;
      if(arguments.length > 0){
        if (arguments[0]) {
          startDate = arguments[0].date || arguments[0]; // to handle both objects containing dates and date objects
        }
        if(arguments[1]){
          endDate = arguments[1].date || arguments[1];
        }
      }
      getStockCountWithFacilitiesAndAppConfig(startDate, endDate)
        .then(function(resolved) {
          var groupedStockCount = groupByFacility(resolved[1]);
          var facilities = resolved[0];
          var summaryHeader = [];
          var configObject = {};
          var appConfigData = resolved[2];
          for (var i = 0; i < appConfigData.length; i++) {
            var appConfig = appConfigData[i];
            var facilityStockCount = groupedStockCount[appConfig.facility._id] || [];
            var sortedStockCount = getSortedStockCount(facilityStockCount);
            var latestStockCount = sortedStockCount[0] || {};
            var previousStockCount = sortedStockCount[1] || null;
            appConfig.facility = facilities[appConfig.facility._id] || appConfig.facility;
            var currentDueDate = getStockCountDueDate(appConfig.facility.stockCountInterval, appConfig.facility.reminderDay);
            var nextCountDate = currentDueDate.getTime() + new Date(1000 * 60 * 60 * 24 * appConfig.facility.stockCountInterval).getTime();
            var daysFromLastCount =  latestStockCount.countDate ? getDaysFromLastCountDate(new Date(latestStockCount.countDate)) : null;
            var hasPendingCount = latestStockCount.countDate ? hasPendingStockCount(new Date(latestStockCount.countDate), currentDueDate) : true;

              configObject[appConfig.facility._id] = appConfig;
              summaryHeader.push({
                facility: appConfig.facility.name,
                createdDate: latestStockCount.created || '',
                facilityUUID: appConfig.facility._id,
                reminderDay: utility.getWeekDay(appConfig.facility.reminderDay),
                previousCountDate: previousStockCount !== null ? previousStockCount.countDate : 'None',
                previousCreatedDate: previousStockCount !== null ? previousStockCount.created : 'None',
                currentDueDate: currentDueDate,
                mostRecentCountDate: latestStockCount.countDate,
                nextCountDate: nextCountDate,
                stockCountInterval: appConfig.facility.stockCountInterval,
                completedCounts: facilityStockCount.length,
                hasPendingStockCount: hasPendingCount,
                daysFromLastCountDate: daysFromLastCount,
                workingPhone: appConfig.workingPhone
              });
            }


          deferred.resolve({
            summary: summaryHeader,
            groupedStockCount: groupedStockCount,
            appConfig: configObject
          });
        })
        .catch(function(reason) {
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
        .sort(function(a, b) {
          if (a.created > b.created) return -1;
          if (a.created < b.created) return 1;
          return 0;
        })
        .filter(function(row) {
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
          ProductType.all(),
          ProductCategory.all()
        ])
        .then(function(response) {
          var productProfiles = response[0];
          var productTypes = response[1];
          var productCategories = response[2];

          rows.forEach(function(row) {
            if (row.unopened) {
              var unopened = {};
              Object.keys(row.unopened).forEach(function(key) {
                var productProfile = productProfiles[key];
                var productType = ((productProfile && productProfile.product) ? productTypes[productProfile.product] : undefined) || ProductType.unknown;
                var productCategory = ((productProfile && productProfile.category) ? productCategories[productProfile.category] : undefined) || ProductCategory.unknown;

                unopened[productType.uuid] = unopened[productType.uuid] || {
                  productType: productType || ProductType.unknown,
                  productCategory: productCategory || ProductCategory.unknown,
                  count: 0
                };

                unopened[productType.uuid].count += row.unopened[key];
              });

              row.unopened = Object.keys(unopened).map(function(key) {
                return unopened[key];
              });
            }
          });

          d.resolve(rows);
        })
        .catch(function(error) {
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
      all: function() {
        var d = $q.defer();
        $q.all([
            utility.request(URL),
            Facility.all()
          ])
          .then(function(response) {
            var rows = response[0];
            var facilities = response[1];

            rows.forEach(function(row) {
              row.facility = (row.facility ? facilities[row.facility] : undefined) || Facility.unknown;
              ['created', 'modified', 'countDate', 'dateSynced'].forEach(function(date) {
                if (row[date])
                  row[date] = moment(row[date]).toDate();
              });
            });

            d.resolve(rows);
          })
          .catch(function(error) {
            console.log(error);
            d.reject(error);
          });

        return d.promise;
      },
      /**
       * Read data from stockcount/unopened db view and arrange it by facility and date. Every item
       * has a facility name, a date and a hash of productType -> count.
       */
      byFacilityAndDate: function() {
        var d = $q.defer();
        $q.all([
            utility.request(URL + '/unopened'),
            Facility.all()
          ])
          .then(function(response) {
            var rows = response[0];
            var facilities = response[1];

            rows.forEach(function(row) {
              row.facility = (row.facility ? facilities[row.facility] : undefined) || Facility.unknown;
              if (row['date'])
                row['date'] = moment(row['date']).toDate();
            });

            groupByProductType(rows)
              .then(function(row) {
                d.resolve(addInventoryRules(row));
              })
              .catch(function(error) {
                console.log(error);
                d.reject(error);
              });
          })
          .catch(function(error) {
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
