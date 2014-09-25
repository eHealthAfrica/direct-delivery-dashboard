'use strict';

angular.module('lmisApp')
  .controller('WasteCountCtrl', function($scope, wasteCountFactory, Pagination, $filter, utility, Places, Facility) {
    var rows = [];
    var latestRows = [];

    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.totals = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.csvHeader = [
      's/n',
      'State',
      'Zone',
      'LGA',
      'Ward',
      'Facility',
      'Created Date',
      'Product',
      'Reason',
      'Quantity'
    ];



    $scope.$watch('search', function() {
      updateFilteredRows();
    }, true);

    function updateFilteredRows() {
      $scope.filteredRows = $filter('filter')(rows, $scope.search, function(actual, expected) {
        var matches = true;
        Object.keys(expected).some(function(key) {
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

    function filter(rows, filterBy) {
      var search = $scope.place.search.toLowerCase();

      return rows.filter(function (row) {
        var date = moment(row.created);
        var include = true;

        if (search && filterBy)
          include = include && (row.facility[filterBy].toLowerCase() == search);

        if ($scope.from.date)
          include = include && (date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date));

        if ($scope.to.date)
          include = include && (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date));

        return include;
      });
    }

    wasteCountFactory.getFormatted()
      .then(function(formattedWasteCount) {
        rows = formattedWasteCount;
        updateFilteredRows();
        $scope.loading = false;
      })
      .catch(function(reason) {
        $scope.loading = false;
        $scope.error = true;
        console.log(reason);
      });
  });
