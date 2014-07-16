'use strict';

angular.module('lmisApp')
  .controller('MainCtrl', function ($scope, facilities, productProfiles, productTypes) {
    $scope.facilities = facilities;
    $scope.productProfiles = productProfiles;
    $scope.productTypes = productTypes;
  })
  .controller('UnopenedCtrl', function ($scope, stockcountUnopened) {
    $scope.rows = [];
    $scope.mostRecent = [];
    $scope.chartData = [];
    $scope.chartFacility = '';
    $scope.loading = true;
    $scope.error = false;

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

      $scope.rows.forEach(function (row) {
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

    function setMostRecent(rows) {
      var recent = {};

      rows.forEach(function (row) {
        // use name of facility
        row.facility = $scope.facilities[row.facility].name;

        var mostRecent = recent[row.facility] = recent[row.facility] || [];
        if (mostRecent.length < 5)
          mostRecent.push(row);
      });

      Object.keys(recent).sort().forEach(function (key) {
        recent[key][0].mostRecentCount = recent[key].length;
        recent[key].forEach(function (row) {
          $scope.mostRecent.push(row);
        })
      });
    }

    stockcountUnopened.byFacilityAndDate()
      .then(function (rows) {
        $scope.rows = rows.filter(function (row) {
          return (row.facility && $scope.facilities[row.facility]);
        });

        setMostRecent($scope.rows);

        var firstChart = '';
        $scope.rows.forEach(function (row) {
          if (!firstChart || row.facility < firstChart)
            firstChart = row.facility;
        });
        $scope.setChartData(firstChart);
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  });
