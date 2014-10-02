'use strict';

angular.module('lmisApp')
  .controller('StockCountSummaryCtrl', function($scope, stockCount) {
    $scope.facilityStockCounts = {};
    $scope.toggleAllMode = false;
    stockCount.stockCountSummaryByFacility()
      .then(function(data) {
        $scope.stockCountSummary = data.summary;
        $scope.groupedStockCount = data.groupedStockCount
      })
      .catch(function(reason) {
        console.error(reason);
      });

    var setStockCountRowCollapse = function() {
      $scope.stockCountRowCollapse = {};
    };

    var getFacilityKeys = function() {
      return Object.keys($scope.groupedStockCount);
    };

    var expandAll = function() {
      setStockCountRowCollapse();
      var facilityKeys = getFacilityKeys();
      for (var i = 0; i < facilityKeys.length; i++) {
        $scope.stockCountRowCollapse[facilityKeys[i]] = true;
        $scope.facilityStockCounts[facilityKeys[i]] = $scope.groupedStockCount[facilityKeys[i]];
      }
    };

    var collapseAll = function() {
      setStockCountRowCollapse();
      var facilityKeys = getFacilityKeys();
      for (var i = 0; i < facilityKeys.length; i++) {
        $scope.stockCountRowCollapse[facilityKeys[i]] = false;
      }
    };

    $scope.toggleAll = function() {
      if (!$scope.toggleAllMode) {
        expandAll();
        $scope.toggleAllMode = true;
      }
      else {
        collapseAll();
        $scope.toggleAllMode = false;
      }
    };

    setStockCountRowCollapse();

    $scope.toggleRow = function(facilityID) {

      if ($scope.stockCountRowCollapse.hasOwnProperty(facilityID)) {
        var currentState = $scope.stockCountRowCollapse[facilityID];
        setStockCountRowCollapse();
        $scope.stockCountRowCollapse[facilityID] = !currentState;
        $scope.toggleAllMode = false;
      }
      else {
        setStockCountRowCollapse();
        $scope.stockCountRowCollapse[facilityID] = true;
        $scope.facilityStockCounts[facilityID] = $scope.groupedStockCount[facilityID];
        $scope.toggleAllMode = false;
      }
    };
  });