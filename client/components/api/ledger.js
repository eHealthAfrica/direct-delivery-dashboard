'use strict';

angular.module('lmisApp')
  .factory('ledgerFactory', function($rootScope, $http, $q, utility, Facility, ProductProfile, ProductType) {
    var URL = '/api/bundles';
    var allPromise = null;

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    function all(reload) {
      var promise = allPromise;

      if (reload || !promise) {
        promise = allPromise = utility.request(URL);
        promise.catch(function(err) {
          allPromise = null;
        });
      }

      return promise;
    }

    function getFormattedBundleLines() {
      var deferred = $q.defer();
      var rows = [];
      var promises = [
        all(),
        Facility.all(),
        ProductProfile.all(),
        ProductType.all()
      ];
      $q.all(promises)
        .then(function(response) {
          var bundles = response[0];
          var facilities = response[1];
          var productProfiles = response[2];
          var bundleTypes = ['Incoming Bundle', 'Outgoing Bundle'];
          var productType = response[3];

          bundles.forEach(function(bundle) {
            bundle.receivingFacilityName = getFacility(bundle.receivingFacility, facilities);
            bundle.sendingFacilityName = getFacility(bundle.sendingFacility, facilities);
            bundle.receivingFacilityObject = getFacilityObject(bundle.receivingFacility, facilities);
            bundle.sendingFacilityObject = getFacilityObject(bundle.sendingFacility, facilities);
            bundle.type = bundleTypes[parseInt(bundle.type)];

            bundle.bundleLines.forEach(function(bundleLine) {

              bundleLine.type = bundle.type;
              bundleLine.receivedOn = new Date(bundle.receivedOn);
              bundleLine.receivingFacility = bundle.receivingFacilityName;
              bundleLine.sendingFacility = bundle.sendingFacilityName;
              bundleLine.receivingFacilityObject = bundle.receivingFacilityObject;
              bundleLine.sendingFacilityObject = bundle.sendingFacilityObject;
              bundleLine.uuid = bundle.uuid;
              bundleLine.modified = bundle.modified;
              bundleLine.created = new Date(bundle.created);
              bundleLine.productCode = getProductTypeCode(bundleLine.productProfile, productType, productProfiles);
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
      }
      else {
        facilityName = angular.isDefined(facilityObjectList[facility]) ? facilityObjectList[facility].name : facility;
      }
      return facilityName;
    }

    function getFacilityObject(facility, facilityObjectList) {
      var facilityName = '';
      if (toString.call(facility) === '[object Object]') {
        facilityName = facility;
      }
      else {
        facilityName = angular.isDefined(facilityObjectList[facility]) ? facilityObjectList[facility] : facility;
      }
      return facilityName;
    }

    function getProductProfile(productProfile, productProfileObjectList) {
      var productProfileName = '';
      if (toString.call(productProfile) === '[object Object]') {
        productProfileName = productProfile.name;
      }
      else {
        productProfileName = angular.isDefined(productProfileObjectList[productProfile]) ? productProfileObjectList[productProfile].name : productProfile;
      }

      return productProfileName;
    }

    function getProductTypeCode(productProfile, productTypes, productProfileObjectList) {
      var productCode = '';
      if (toString.call(productProfile) === '[object Object]') {
        productCode = productTypes[productProfile.product].code;
      }
      else {
        productCode = angular.isDefined(productProfileObjectList[productProfile]) ? productTypes[productProfileObjectList[productProfile].product].code : productProfile;
      }
      return productCode;
    }

    return {
      all: all,
      getFormattedBundleLines: getFormattedBundleLines,
      getFacility: getFacility,
      getProductProfile: getProductProfile
    };
  });