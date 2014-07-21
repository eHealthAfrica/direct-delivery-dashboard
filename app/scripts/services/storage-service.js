'use strict';

angular.module('lmisApp')
  .factory('storageService', function (SETTINGS, $http, $cacheFactory) {

    var getDB = function(dbName){
      return SETTINGS.dbUrl + '/' + dbName;
    };

    var getAll = function(dbName, paramObject){
      paramObject = angular.isDefined(paramObject) ? paramObject : {};
      paramObject = (Object.keys(paramObject)).length === 0 ? {include_docs:true} : paramObject;
      var configObject = angular.isDefined(paramObject.config) ? paramObject.config : {};

      return $http.get(getDB(dbName) + '/_all_docs' + createParams(paramObject), configObject);
    };

    var createParams = function(paramObject){
      var params = [];
      if(angular.isObject(paramObject)){
        for(var key in paramObject){
          if(key !== 'config') {
            params.push(key + '=' + paramObject[key]);
          }
        }
      }
      return params.length > 0 ? '?'+params.join('&') : '';
    };

    var getCustomView = function(dbName, paramObject){
      paramObject = angular.isDefined(paramObject) ? paramObject : {};
      paramObject = angular.isObject(paramObject) ? paramObject: {};
      var config = {
        method: angular.isDefined(paramObject.method) ? paramObject.method : 'POST',
        url: getDB(dbName)+'/_temp_view',
        data: angular.isDefined(paramObject.data) ? paramObject.data : {include_docs: true}
      };
      if(angular.isUndefined(paramObject.cache)){
        var cache = $cacheFactory.get(dbName);
        config.cache = angular.isDefined(cache) ? cache : $cacheFactory(dbName, {capacity: 2});
      }

      return $http(config);
    };

    var remove = function(dbName, id, revision){
      return $http.delete(getDB(dbName) +'/'+ id + '?rev=' + revision);
    };

    return {
      all: getAll,
      remove: remove,
      getCustomView: getCustomView
    };
  });