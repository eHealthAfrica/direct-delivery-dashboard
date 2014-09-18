'use strict';

angular.module('lmisApp')
  .controller('StockCountCtrl', function ($scope, $q, $filter, Pagination, Places, ProductType, Facility, stockCount) {
    var rows = [];

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
          groupBy = 'name';
          columnTitle = 'Facility';
          break;
        case Places.FACILITY:
          filterBy = 'name';
          groupBy = 'name';
          columnTitle = 'Facility';
          break;
      }

      if ($scope.place.search.length) {
        var search = $scope.place.search.toLowerCase();
        rows
          .filter(function (row) {
            var date = moment(row.created);
            return ((row.facility[filterBy].toLowerCase() == search) &&
              (date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date)) &&
              (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date)))
          })
          .forEach(function (row) {
            var key = row.facility[groupBy];
            totals[key] = totals[key] || {
              place: key,
              values: {}
            };

            row.unopened.forEach(function (unopened) {
              var code = unopened.productType.code;
              totals[key].values[code] = (totals[key].values[code] || 0) + unopened.count;
            });
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

    $q.all([
        ProductType.codes(),
        stockCount.all()
      ])
      .then(function (responses) {
        $scope.productTypes = responses[0];

        stockCount.resolveUnopened(stockCount.latest(responses[1]))
          .then(function (resolved) {
            rows = resolved;

            var startState = '';

            rows.forEach(function (row) {
              if (!startState.length || (row.facility.state != Facility.unknown.state && row.facility.state < startState))
                startState = row.facility.state;
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
      })
      .catch(function () {
        $scope.loading = false;
        $scope.error = true;
      })
  })
  .controller('StockCountSummaryCtrl', function ($scope, stockCount) {

    $scope.facilityStockCounts = {};
    $scope.toggleAllMode = false;
    stockCount.stockCountSummaryByFacility()
      .then(function (data) {
        $scope.stockCountSummary = data.summary;
        $scope.groupedStockCount = data.groupedStockCount
      })
      .catch(function (reason) {
        console.error(reason);
      });

    var setStockCountRowCollapse = function () {
      $scope.stockCountRowCollapse = {};
    };

    var getFacilityKeys = function () {
      return Object.keys($scope.groupedStockCount);
    };

    var expandAll = function () {
      setStockCountRowCollapse();
      var facilityKeys = getFacilityKeys();
      for (var i = 0; i < facilityKeys.length; i++) {
        $scope.stockCountRowCollapse[facilityKeys[i]] = true;
        $scope.facilityStockCounts[facilityKeys[i]] = $scope.groupedStockCount[facilityKeys[i]];
      }
    };

    var collapseAll = function () {
      setStockCountRowCollapse();
      var facilityKeys = getFacilityKeys();
      for (var i = 0; i < facilityKeys.length; i++) {
        $scope.stockCountRowCollapse[facilityKeys[i]] = false;
      }
    };

    $scope.toggleAll = function () {
      if (!$scope.toggleAllMode) {
        expandAll();
        $scope.toggleAllMode = true;
      } else {
        collapseAll();
        $scope.toggleAllMode = false;
      }
    };

    setStockCountRowCollapse();

    $scope.toggleRow = function (facilityID) {

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
