'use strict';

angular.module('lmisApp')
  .service('stockCountFactory', function ($q, facilityFactory, cacheService, couchdb,
                                          utility, $filter, appConfigFactory) {

    var DB_NAME = 'stockcount';
    var DAILY = 1;
    var WEEKLY = 7;
    var BI_WEEKLY = 14;
    var MONTHLY = 30;

    var getAllFromServer = function () {
      var deferred = $q.defer();
      var cache = cacheService.cache(DB_NAME);

      couchdb.allDocs({_db: DB_NAME}).$promise
        .then(function (stockCount) {
          cache.put(DB_NAME, stockCount);
          deferred.resolve(stockCount);
        })
        .catch(function (reason) {
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    var getAll = function () {
      var deferred = $q.defer();
      var cache = cacheService.cache(DB_NAME);
      var cached = cache.get(DB_NAME);
      if (angular.isDefined(cached)) {
        deferred.resolve(cached);
        getAllFromServer();
        return deferred.promise;
      }
      return getAllFromServer();
    };

    var getStockCountWithFacilitiesAndAppConfig = function () {
      var promises = [
        facilityFactory.getObjects(),
        getAll(),
        appConfigFactory.all()
      ];

      return $q.all(promises);
    };

    var groupByFacility = function (stockCount) {
      var groupedStockCount  = {};

      for(var i = 0; i < stockCount.length; i++ ){
        if(groupedStockCount.hasOwnProperty(stockCount[i].doc.facility)){
          groupedStockCount[stockCount[i].doc.facility].push(stockCount[i]);
        } else {
          groupedStockCount[stockCount[i].doc.facility] = [];
          groupedStockCount[stockCount[i].doc.facility].push( stockCount[i]);
        }
      }
      return groupedStockCount;
    };

    var getSortedStockCount = function (stockCountList) {
      return stockCountList
        .sort(function (a, b){
          return new Date(a.doc.created).getTime() < new Date(b.doc.created).getTime();
        });
    };

    var getDaysFromLastCountDate = function (lastCountDate) {
      if (Object.prototype.toString.call(lastCountDate) !== '[object Date]') {
        throw "value provided is not a date object";
      }

      var one_day=1000*60*60*24;
      var difference_ms = new Date().getTime() - lastCountDate.getTime();

      return Math.round(difference_ms/one_day);
    };

    var getStockCountDueDate = function(interval, reminderDay, date){
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
          if(currentDate.getTime() < countDate.getTime()){
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
          var monthlyDate = (currentDate.getTime() === today.getTime())? 1 : currentDate.getDate();
          countDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), monthlyDate);
          break;
        default:
          countDate = utility.getWeekRangeByDate(currentDate, reminderDay).reminderDate;
          if(currentDate.getTime() < countDate.getTime()){
            //current week count date is not yet due, return previous week count date..
            countDate = new Date(countDate.getFullYear(), countDate.getMonth(), countDate.getDate() - interval);
          }
      }
      return countDate
    };

    var hasPendingStockCount = function (lastCountDueDate, currentDueDate) {
      return !(lastCountDueDate.getTime() === currentDueDate.getTime());
    };

    var stockCountSummaryByFacility = function () {

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

            if (angular.isDefined(facilities[key])){

              var facilityConfig = appConfig[facilities[key].doc.email];
              if(angular.isDefined(facilityConfig)){
                var currentDueDate = getStockCountDueDate(facilityConfig.value.facility.stockCountInterval, facilityConfig.value.facility.reminderDay);
                var nextCountDate = currentDueDate.getTime() + new Date(1000 * 60 * 60 * 24 * facilityConfig.value.facility.stockCountInterval).getTime();
                var daysFromLastCount = getDaysFromLastCountDate(new Date(latestStockCount.doc.countDate));

                summaryHeader.push({
                  facility: facilityConfig.value.facility.name,
                  createdDate: $filter('date')(latestStockCount.doc.created, 'dd MMM yyyy HH:mm'),
                  facilityUUID: key,
                  reminderDay: utility.getWeekDay(facilityConfig.value.facility.reminderDay),
                  previousCountDate: previousStockCount !== null ? $filter('date')(previousStockCount.doc.countDate, 'dd MMM yyyy') : 'None',
                  previousCreatedDate: previousStockCount !== null ? $filter('date')(previousStockCount.doc.created, 'dd MMM yyyy HH:mm') : 'None',
                  currentDueDate: $filter('date')(currentDueDate, 'dd MMM yyyy'),
                  mostRecentCountDate: $filter('date')(latestStockCount.doc.countDate, 'dd MMM yyyy'),
                  nextCountDate: $filter('date')(new Date(nextCountDate), 'dd MMM yyyy') ,
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
    };

    return {
      all: getAll,
      groupByFacility: groupByFacility,
      stockCountSummaryByFacility: stockCountSummaryByFacility,
      getStockCountDueDate: getStockCountDueDate,
      getDaysFromLastCountDate: getDaysFromLastCountDate,
      getSortedStockCount: getSortedStockCount,
      hasPendingStockCount: hasPendingStockCount
    };
  });
