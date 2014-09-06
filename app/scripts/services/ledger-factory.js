'use strict';

angular.module('lmisApp')
  .factory('ledgerFactory', function ($rootScope, $q, couchdb, Facility, ProductProfile) {
    var dbName = 'bundle';
    var allPromise = null;

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    /**
     * Read data from db and arrange it as a hash of uuid -> product profile
     */
    function all(reload) {
      if (!reload && allPromise)
        return allPromise;

      var d = $q.defer();
      allPromise = d.promise;

      couchdb.allDocs({_db: dbName}).$promise
        .then(function (response) {
          var bundles = {};
          response.rows.forEach(function (row) {
            bundles[row.doc.uuid] = row.doc;
          });
          d.resolve(bundles);
        })
        .catch(function (error) {
          console.log(error);
          allPromise = null;
          d.reject(error);
        });

      return d.promise;
    }

    function allList(reload) {
      if (!reload && allPromise)
        return allPromise;

      var d = $q.defer();
      allPromise = d.promise;

      couchdb.allDocs({_db: dbName}).$promise
        .then(function (response) {
          var bundles = [];
          response.rows.forEach(function (row) {
            bundles.push( row.doc );
          });
          d.resolve(bundles);
        })
        .catch(function (error) {
          console.log(error);
          allPromise = null;
          d.reject(error);
        });

      return d.promise;
    }

    function getFormattedBundleLines() {
      var deferred = $q.defer();
      var rows = [];
      var promises = [
        allList(),
        Facility.all(),
        ProductProfile.all()
      ];
      $q.all(promises)
        .then(function(response) {
          var bundles = response[0];
          var facilities = response[1];
          var productProfiles = response[2];
          var bundleTypes = ['Incoming Bundle', 'Outgoing Bundle'];

          bundles.forEach(function(bundle) {
            bundle.receivingFacility = getFacility(bundle.receivingFacility, facilities);
            bundle.sendingFacility = getFacility(bundle.sendingFacility, facilities);
            bundle.type = bundleTypes[parseInt(bundle.type)];

            bundle.bundleLines.forEach(function(bundleLine) {
              bundleLine.type = bundle.type;
              bundleLine.receivedOn = bundle.receivedOn;
              bundleLine.receivingFacility = bundle.receivingFacility;
              bundleLine.sendingFacility = bundle.sendingFacility;
              bundleLine.facilityName = bundle.facilityName;
              bundleLine.uuid = bundle.uuid;
              bundleLine.modified = bundle.modified;
              bundleLine.created = bundle.created;
              bundleLine.productProfile = getProductProfile(bundleLine.productProfile, productProfiles);
              rows.push(bundleLine);
            });
          });

          deferred.resolve(rows);
        })
        .catch(function(reason) {
          deferred.reject(reason);
        });


      return deferred.promise;
    }

    function getFacility(facility, facilityObjectList) {
      var facilityName = '';
      if (toString.call(facility) === '[object Object]') {
        facilityName = facility.name;
      } else {
        facilityName = angular.isDefined(facilityObjectList[facility]) ? facilityObjectList[facility].name : facility;
      }
      return facilityName;
    }

    function getProductProfile(productProfile, productProfileObjectList) {
      var productProfileName = '';
      if (toString.call(productProfile) === '[object Object]') {
        productProfileName = productProfile.name;
      } else {
        productProfileName = angular.isDefined(productProfileObjectList[productProfile]) ? productProfileObjectList[productProfile].name : productProfile;
      }

      return productProfileName;
    }

    return {
      all: allList,
      getFormattedBundleLines: getFormattedBundleLines,
      getFacility: getFacility,
      getProductProfile: getProductProfile
    };
  });