'use strict';

angular.module('lmisApp')
  .service('cacheService', function cacheService($cacheFactory) {
    this.cache = function (cacheID, config) {
      config = angular.isDefined(config) ? config : {};
      var cache = $cacheFactory.get(cacheID);
      return angular.isDefined(cache) ? cache : $cacheFactory(cacheID, config);
    };

    this.updateCachedCopy = function (cacheServiceInstance, key, value) {
      cacheServiceInstance.put(key, value);
    }
  });
