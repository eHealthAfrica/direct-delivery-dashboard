'use strict';

angular.module('lmisApp')
  .factory('facilityFactory', function ($q, storageService, utility, cacheService) {

    var DB_NAME = 'facilities',
        CONNECTION_IN_PROGRESS;

    var getAllFromServer = function () {
      var deferred = $q.defer();
      var cache = cacheService.cache(DB_NAME);

      CONNECTION_IN_PROGRESS = true;

      storageService.all(DB_NAME)
        .success(function (data) {
          cache.put(DB_NAME, data.rows);
          deferred.resolve(data.rows);
          CONNECTION_IN_PROGRESS = false;
        })
        .error(function (reason) {
          CONNECTION_IN_PROGRESS = false;
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    var getAll = function (){
      var deferred = $q.defer();
      var cache = cacheService.cache(DB_NAME);
      var cached = cache.get(DB_NAME);
      if(angular.isDefined(cached)){
        deferred.resolve(cached);
        if (!CONNECTION_IN_PROGRESS){
          getAllFromServer();
        }
        return deferred.promise;
      }
      return getAllFromServer();
    };

    var getAllObject = function () {
      var deferred = $q.defer();
      getAll()
        .then(function (data) {
          deferred.resolve(utility.castArrayToObject(data, 'id'));
        })
        .catch(function (reason) {
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    return {
      all: getAll,
      getObjects: getAllObject
    };
  });
