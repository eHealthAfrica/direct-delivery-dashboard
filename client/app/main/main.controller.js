'use strict';

angular.module('lmisApp')
  .controller('MainCtrl', function ($scope, facilities, productProfiles, productTypes) {
    $scope.facilities = facilities;
    $scope.productProfiles = productProfiles;
    $scope.productTypes = productTypes;
  })
  .controller('UnopenedCtrl', function ($scope, $filter, Auth, stockCount) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.mostRecent = [];
    $scope.chartData = [];
    $scope.chartFacility = '';
    $scope.loading = true;
    $scope.error = false;

    var rows = [];

    $scope.formatDateAxisFunction = function () {
      return function (d) {
        return d3.time.format('%Y-%m-%d')(new Date(d));
      }
    };

    $scope.count = function (row, productType) {
      var product = row.products[productType];
      return (product && product.count !== undefined) ? product.count : '-';
    };

    $scope.isOut = function (row, productType) {
      var product = row.products[productType];
      return (product && product.count < product.min);
    };

    $scope.setChartData = function (facility) {
      if (!facility)
        return;

      var products = {};

      rows.forEach(function (row) {
        if (row.facility == facility) {
          Object.keys(row.products).forEach(function (key) {
            if (!products[key]) {
              products[key] = {
                'key': $scope.productTypes[key] ? $scope.productTypes[key].code : undefined,
                'values': []
              }
            }

            products[key].values.push([row.date.getTime(), row.products[key].count]);
          });
        }
      });

      $scope.chartFacility = facility;
      $scope.chartData = Object.keys(products).map(function (key) {
        // sort values by date
        products[key].values.sort(function (a, b) {
          if (a[0] < b[0])
            return -1;
          else if (a[0] > b[0])
            return 1;
          else
            return 0;
        });

        return products[key];
      });
    };

    function setMostRecent() {
      var recent = {};

      rows.forEach(function (row) {
        var facility = row.facility.uuid;
        var mostRecent = recent[facility];
        row.mostRecent = false;
        if (!mostRecent || mostRecent.date < row.date) {
          if (mostRecent)
            mostRecent.mostRecent = false;

          row.mostRecent = true;
          recent[facility] = row;
        }
      });

      $scope.mostRecent = $filter('orderBy')($filter('filter')(rows, {mostRecent: true}), ['-date', 'facility.name']);
    }

    stockCount.byFacilityAndDate()
      .then(function (data) {
        rows = data.filter(function (row) {
          return !!row.facility;
        });

        setMostRecent();
        if ($scope.mostRecent.length)
          $scope.setChartData($scope.mostRecent[0].facility);
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  })
  .controller('MainStockOutCtrl', function ($scope, Auth, stockOut) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    stockOut.byDate({ limit: 10 })
      .then(function (rows) {
        $scope.rows = rows;
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  })
  .controller('MainCCUBreakdownCtrl', function ($scope, Auth, ccuBreakdown) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    ccuBreakdown.byDate({ limit: 10 })
      .then(function (rows) {
        $scope.rows = rows;
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  });
