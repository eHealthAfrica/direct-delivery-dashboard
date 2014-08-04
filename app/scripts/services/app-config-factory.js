'use strict';

angular.module('lmisApp')
  .factory('appConfigFactory', function ($q, Facility, couchdb) {

    var DB_NAME = 'app_config';

    var getAll = function () {
      var deferred = $q.defer();
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
        map: '(' + mapFunc + ')'
      };

      couchdb.mapReduce({_db: DB_NAME, include_docs: false}, params).$promise
        .then(function (appConfig) {
          deferred.resolve(appConfig);
        })
        .catch(function (reason) {
          deferred.reject(reason);
        });

      return deferred.promise;
    };

    var getAppConfigWithFacilities = function () {
      var promises = [
        Facility.getObjects(),
        getAll()
      ];

      return $q.all(promises);
    };

    return {
      all: getAll,
      getAppConfigWithCategory: getAppConfigWithFacilities
    };
  });
