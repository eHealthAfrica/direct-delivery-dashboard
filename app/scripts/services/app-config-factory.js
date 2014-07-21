'use strict';

angular.module('lmisApp')
  .factory('appConfigFactory', function ($q, storageService, facilityFactory, cacheService) {

    var DB_NAME = 'app_config';

    var getAllFromServer = function () {
      var deferred = $q.defer();
      var cache = cacheService.cache(DB_NAME);
      var mapFunc = function (doc) {
        emit(doc.id, {
          uuid: doc.uuid,
          rev: doc._rev,
          facility: {
            name: doc.facility.name,
            reminderDay: doc.facility.reminderDay,
            stockCountInterval: doc.facility.stockCountInterval
          }

        });
      }.toString();

      var params = {
        data: {
          map: '('+mapFunc+')',
          include_docs: false
        },
        method: 'POST',
        cache: true
      };

      storageService.getCustomView(DB_NAME, params)
        .success(function (appConfig) {
          cache.put(DB_NAME, appConfig);
          deferred.resolve(appConfig);
        })
        .error(function (reason) {
          deferred.reject(reason);
        });

      return deferred.promise;
    };

    var getAll = function () {
      var deferred = $q.defer();
      var cache = cacheService.cache(DB_NAME);
      var cached = cache.get(DB_NAME);
      if(angular.isDefined(cached)){
        deferred.resolve(cached);
        getAllFromServer();
        return deferred.promise;
      }
      return getAllFromServer();
    };

    var getAppConfigWithFacilities = function () {
      var promises = [
        facilityFactory.getObjects(),
        getAll()
      ];

      return $q.all(promises);
    };

    return {
      all: getAll,
      getAppConfigWithCategory: getAppConfigWithFacilities
    };
  });
