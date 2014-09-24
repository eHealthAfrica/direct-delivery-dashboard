'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/waste-count', {
        templateUrl: 'views/waste-count.html',
        controller: 'WasteCountCtrl'
      })
  })
  .controller('WasteCountCtrl', function ($scope, wasteCountFactory, Pagination, $filter) {
    var rows = [];

    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.totals = [];
    $scope.loading = true;
    $scope.error = false;

    $scope.updateTotals = function () {
      var totals = {};
      $scope.totals = Object.keys(totals).map(function (key) {
        var item = totals[key];
        return {};
      });
    };



    $scope.$watch('search', function () {
      updateFilteredRows();
    }, true);

    function updateFilteredRows() {
      $scope.filteredRows = $filter('filter')(rows, $scope.search, function (actual, expected) {
        var matches = true;
        Object.keys(expected).some(function (key) {
          if (actual[key] === undefined || actual[key].toLowerCase().indexOf(expected[key].toLowerCase()) < 0) {
            matches = false;
            return true;
          }

          return false;
        });

        return matches;
      });

      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    wasteCountFactory.getFormatted()
      .then(function(formattedWasteCount) {
        $scope.wasteCount = formattedWasteCount;
        rows = formattedWasteCount;
        updateFilteredRows();
      })
      .catch(function(reason) {
        console.log(reason);
      });
  });