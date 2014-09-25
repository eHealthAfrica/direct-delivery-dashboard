'use strict';

angular.module('lmisApp')
  .factory('wasteCountFactory', function ($q, couchdb, ProductProfile, UomFactory, ProductPresentation, Facility) {
    var DB_NAME = 'discard_count';
    var wasteReasons = [
      'VVM Stage 3',
      'Broken Vial',
      'Label Missing',
      'Unopened Expiry',
      'Opened Expiry',
      'Suspected Freezing',
      'Other'
    ];

    function getAll() {
      var deferred = $q.defer();
      couchdb.allDocs({_db: DB_NAME}).$promise
        .then(function(response) {
          deferred.resolve(getDocFromRows(response.rows))
        })
        .catch(function(reason) {
          deferred.reject(reason);
        });

      return deferred.promise;
    }

    function getDocFromRows(rows) {
      var docs = [];
      rows.forEach(function(row) {
        docs.push(row.doc);
      });
      return docs;
    }

    function getFormattedWasteCount() {

      var deferred = $q.defer();
      var promises = [
        getAll(),
        Facility.all(),
        ProductProfile.all(),
        UomFactory.all(),
        ProductPresentation.all()
      ];

      $q.all(promises)
        .then(function(resolved) {
          var wasteCounts = resolved[0],
              facilities = resolved[1],
              productProfiles = resolved[2],
              uomList = resolved[3],
              productPresentation = resolved[4];
          var formattedWasteCount = [];
          wasteCounts
            .forEach(function(wasteCount) {

              var list = {
                uuid: wasteCount.uuid,
                facilityName: angular.isUndefined(facilities[wasteCount.facility]) ? wasteCount.facility : facilities[wasteCount.facility].name,
                created: wasteCount.created,
                reasons: [],
                productLevelList: {}
              };

              (Object.keys(wasteCount.discarded)).forEach(function(productProfileUUID) {

                if (angular.isDefined(productProfiles[productProfileUUID])) {
                  var uom = uomList[productPresentation[productProfiles[productProfileUUID].presentation].uom].symbol;
                  list.productLevelList[productProfileUUID] = (Object.keys(wasteCount.reason[productProfileUUID])).length;

                  (Object.keys(wasteCount.reason[productProfileUUID])).forEach(function(reason, index) {

                    list.reasons.push({
                      uuid: wasteCount.uuid,
                      productIndex: index,
                      value: wasteCount.reason[productProfileUUID][reason],
                      key: productProfileUUID,
                      productProfile: productProfiles[productProfileUUID].name,
                      reason: wasteReasons[reason],
                      uom: uom,
                      created: wasteCount.created,
                      productList: (Object.keys(wasteCount.discarded)).length
                    });

                  });

                }

              });

              formattedWasteCount.push(list);
            });

          deferred.resolve(formattedWasteCount);
        })
        .catch(function(reason) {
          deferred.reject(reason);
        });

      return deferred.promise;
    }

    return {
      all: getAll,
      getFormatted: getFormattedWasteCount
    }
  });