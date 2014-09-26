'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/ledger', {
        templateUrl: 'views/ledger.html',
        controller: 'ledgerCtrl'
      });
  })
  .controller('ledgerCtrl', function ($scope, $q, ledgerFactory, Pagination, $filter) {
    var rows = [];
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.loading = true;
    $scope.error = false;

    $scope.from = {
      opened: false,
      date: moment().startOf('day').subtract('days', 7).toDate(),
      open: function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.to = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.$watch('search', function () {
      updateFilteredRows();
    }, true);

    function updateFilteredRows() {
      $scope.filteredRows = $filter('filter')(rows, $scope.search, function (actual, expected) {

        var matches = true;
        actual = !angular.isDate(actual) && angular.isDefined(actual) ? actual.toLowerCase() : actual;
        expected = !angular.isDate(expected) && angular.isDefined(expected) ? expected.toLowerCase() : expected;

        if (actual === undefined || actual.indexOf(expected) < 0) {
          matches = false;
        }

        return matches;
      });

      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    ledgerFactory.getFormattedBundleLines()
      .then(function(response) {
        rows = response;
        updateFilteredRows();
        $scope.loading = false;
      })
      .catch(function(reason) {
        $scope.loading = false;
        $scope.error = true;
        console.log(reason);
      });


  });