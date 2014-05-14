'use strict';

angular.module('lmisApp')
  .controller('MainCtrl', function ($scope, facilities, products) {
    $scope.facilities = facilities;
    $scope.products = products;
  })
  .controller('UnopenedCtrl', function ($scope, stockcountUnopened) {
    $scope.rows = [];
    $scope.chartData = [];
    $scope.chartFacility = '';
    $scope.loading = true;
    $scope.error = false;

    $scope.formatDateAxisFunction = function () {
      return function (d) {
        return d3.time.format('%Y-%m-%d')(new Date(d));
      }
    };

    $scope.count = function (row, productId) {
      var product = row.products[productId];
      return (product && product.count !== undefined) ? product.count : '-';
    };

    $scope.isOut = function (row, productId) {
      var product = row.products[productId];
      return (product && product.count < product.min);
    };

    $scope.setChartData = function(facility) {
      if (!facility)
        return;

      var products = {};

      $scope.rows.forEach(function (row) {
        if (row.facility == facility) {
          Object.keys(row.products).forEach(function (key) {
            if (!products[key]) {
              products[key] = {
                'key': ($scope.products[key] || key).substr(0, 10),
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
        products[key].values.sort(function(a, b) {
          if (a[0] < b[0])
            return -1;
          else if (a[0] > b[0])
            return 1;
          else
            return 0;
        });

        return products[key];
      });
    }

    stockcountUnopened.byFacilityAndDate()
      .then(function (rows) {
        $scope.rows = prepare(rows);
        var firstChart = '';
        $scope.rows.forEach(function(row) {
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

    function prepare(rows) {
      var recent = {};

      rows.forEach(function(row) {
        var mostRecent = recent[row.facility];
        row.mostRecent = false;
        if (!mostRecent || mostRecent.date < row.date)
        {
          if (mostRecent)
            mostRecent.mostRecent = false;

          row.mostRecent = true;
          recent[row.facility] = row;
        }

        // set facility name at last
        row.facility = $scope.facilities[row.facility];
      });

      return rows;
    }
  });
