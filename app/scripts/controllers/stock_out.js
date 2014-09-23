'use strict';

angular.module('lmisApp')
  .controller('StockOutCtrl', function ($scope, $q, $filter, Pagination, Places, ProductType, stockOut) {
    $scope.rows = [];
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.totals = [];
    $scope.productTypes = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.places = null;

    $scope.place = {
      type: Places.STATE,
      columnTitle: 'Zone',
      search: ''
    };

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

    $scope.getPlaces = function (filter) {
      $scope.places = new Places($scope.place.type, filter);

      return $scope.places.promise;
    };

    $scope.updateTotals = function () {
      var totals = {};
      var filterBy = 'state';
      var groupBy = 'zone';
      var columnTitle = 'Zone';
      switch ($scope.place.type) {
        case Places.ZONE:
          filterBy = 'zone';
          groupBy = 'lga';
          columnTitle = 'LGA';
          break;
        case Places.LGA:
          filterBy = 'lga';
          groupBy = 'ward';
          columnTitle = 'Ward';
          break;
        case Places.WARD:
          filterBy = 'ward';
          groupBy = 'facility';
          columnTitle = 'Facility';
          break;
        case Places.FACILITY:
          filterBy = 'facility';
          groupBy = 'facility';
          columnTitle = 'Facility';
          break;
      }

      if ($scope.place.search.length) {
        var search = $scope.place.search.toLowerCase();
        $scope.rows
          .filter(function (row) {
            var date = moment(row.created);
            return ((row[filterBy].toLowerCase() == search) &&
              (date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date)) &&
              (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date)))
          })
          .forEach(function (row) {
            var key = row[groupBy];
            totals[key] = totals[key] || {
              place: key,
              values: {}
            };

            var value = totals[key].values[row.productType] || 0;
            totals[key].values[row.productType] = value + 1;
          });
      }

      $scope.place.columnTitle = columnTitle;
      $scope.totals = Object.keys(totals).map(function (key) {
        var item = totals[key];
        return {
          place: item.place,
          values: $scope.productTypes.map(function (productType) {
            return (item.values[productType] || 0);
          })
        };
      });
    };

    $scope.$watch('search', function () {
      updateFilteredRows();
    }, true);

    function updateFilteredRows() {
      $scope.filteredRows = $filter('filter')($scope.rows, $scope.search);
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    $q.all([
        ProductType.codes(),
        stockOut.byDate()
      ])
      .then(function (responses) {
        $scope.productTypes = responses[0];

        var rows = responses[1];
        var startState = '';
        $scope.rows = rows
          .filter(function (row) {
            return !!row.facility;
          })
          .map(function (row) {
            if (!startState.length || row.facility.state < startState)
              startState = row.facility.state;

            return {
              state: row.facility.state,
              zone: row.facility.zone,
              lga: row.facility.lga,
              ward: row.facility.ward,
              facility: row.facility.name,
              created: row.created,
              productType: row.productType,
              stockLevel: row.stockLevel
            };
          });

        $scope.place.search = startState;
        $scope.updateTotals();
        updateFilteredRows();
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  });
