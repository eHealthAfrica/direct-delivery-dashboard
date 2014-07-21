'use strict';

angular.module('lmisApp')
  .service('productService', function productService($q, storageService, cacheService) {

    var PRODUCT_PROFILE_DB = 'product_profiles',
        PRODUCT_TYPE_DB = 'product_types',
        PRODUCT_PROFILE_CONNECTION_IN_PROGRESS,
        PRODUCT_TYPE_CONNECTION_IN_PROGRESS;

    this.getProductProfileFromServer = function () {
      var deferred = $q.defer();
      var cache = cacheService.cache(PRODUCT_PROFILE_DB);

      PRODUCT_PROFILE_CONNECTION_IN_PROGRESS = true;

      storageService.all(PRODUCT_PROFILE_DB)
        .success(function (productProfiles) {
          cache.put(PRODUCT_PROFILE_DB, productProfiles);
          deferred.resolve(productProfiles);
          PRODUCT_PROFILE_CONNECTION_IN_PROGRESS = false;
        })
        .error(function (reason) {
          PRODUCT_PROFILE_CONNECTION_IN_PROGRESS = false;
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    this.getProductProfiles = function () {
      var deferred = $q.defer();
      var cache = cacheService.cache(PRODUCT_PROFILE_DB);
      var cached = cache.get(PRODUCT_PROFILE_DB);

      if (angular.isDefined(cached)) {
        deferred.resolve(cached);
        if (!PRODUCT_PROFILE_CONNECTION_IN_PROGRESS){
          this.getProductProfileFromServer();
        }

      }
      return this.getProductProfileFromServer();
    };

    this.getProductTypeFromServer = function () {
      var deferred = $q.defer();
      var cache = cacheService.cache(PRODUCT_TYPE_DB);

      PRODUCT_TYPE_CONNECTION_IN_PROGRESS = true;

      storageService.all(PRODUCT_TYPE_DB)
        .success(function (productTypes) {
          cache.put(PRODUCT_TYPE_DB, productTypes);
          deferred.resolve(productTypes);
          PRODUCT_TYPE_CONNECTION_IN_PROGRESS = false;
        })
        .error(function (reason) {
          PRODUCT_TYPE_CONNECTION_IN_PROGRESS = false;
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    this.getProductTypes = function () {
      var deferred = $q.defer();
      var cache = cacheService.cache(PRODUCT_TYPE_DB);
      var cached = cache.get(PRODUCT_TYPE_DB);

      if (angular.isDefined(cached)) {
        deferred.resolve(cached);
        if (!PRODUCT_TYPE_CONNECTION_IN_PROGRESS){
          this.getProductTypeFromServer();
        }
      }
      return this.getProductTypeFromServer();
    };



  });
