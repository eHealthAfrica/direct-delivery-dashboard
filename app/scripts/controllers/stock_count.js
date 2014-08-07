'use strict';

angular.module('lmisApp')
  .controller('StockCountCtrl', function ($scope, $q, $filter, Pagination, Places, ProductType, stockcountUnopened) {
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
      type: 0,
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
      date: moment().endOf('day').subtract('days', 1).toDate(),
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
      switch (parseInt($scope.place.type)) {
        case 1:
          filterBy = 'zone';
          groupBy = 'lga';
          columnTitle = 'LGA';
          break;
        case 2:
          filterBy = 'lga';
          groupBy = 'ward';
          columnTitle = 'Ward';
          break;
        case 3:
          filterBy = 'ward';
          groupBy = 'facility';
          columnTitle = 'Facility';
          break;
        case 4:
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

            // take first value, which is the most recent one as the data is
            // sorted by date in descending order
            if (totals[key].values[row.productType] === undefined)
              totals[key].values[row.productType] = row.count;
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
        stockcountUnopened.all()
      ])
      .then(function (responses) {
        $scope.productTypes = responses[0];

        var rows = responses[1];
        var startState = '';
        var byProductType = {};

        rows
          .filter(function (row) {
            return !!row.facility;
          })
          .forEach(function (row) {
            if (!startState.length || row.facility.state < startState)
              startState = row.facility.state;

            var key = row.facility.uuid + '#' + row.productType + '#' + row.created;
            byProductType[key] = byProductType[key] || {
              state: row.facility.state,
              zone: row.facility.zone,
              lga: row.facility.lga,
              ward: row.facility.ward,
              facility: row.facility.name,
              created: row.created,
              modified: row.modified,
              productType: row.productType,
              count: 0
            };

            byProductType[key].count += row.count;
          });

        $scope.rows = Object.keys(byProductType)
          .map(function (key) {
            return byProductType[key];
          })
          .sort(function (a, b) {
            if (a.created > b.created) return -1;
            if (a.created < b.created) return 1;
            return 0;
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
  .controller('StockCountSummaryCtrl', function ($scope, stockcountUnopened) {

    $scope.facilityStockCounts = {};
    $scope.toggleAllMode = false;
    stockcountUnopened.stockCountSummaryByFacility()
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
      for (var i = 0; i < facilityKeys.length; i++){
        $scope.stockCountRowCollapse[facilityKeys[i]] = true;
        $scope.facilityStockCounts[facilityKeys[i]] = $scope.groupedStockCount[facilityKeys[i]];
      }
    };

    var collapseAll = function () {
      setStockCountRowCollapse();
      var facilityKeys = getFacilityKeys();
      for (var i = 0; i < facilityKeys.length; i++){
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

      if($scope.stockCountRowCollapse.hasOwnProperty(facilityID)){
        var currentState = $scope.stockCountRowCollapse[facilityID];
        setStockCountRowCollapse();
        $scope.stockCountRowCollapse[facilityID] = !currentState;
        $scope.toggleAllMode = false;
      }
      else{
        setStockCountRowCollapse();
        $scope.stockCountRowCollapse[facilityID] = true;
        $scope.facilityStockCounts[facilityID] = $scope.groupedStockCount[facilityID];
        $scope.toggleAllMode = false;
      }

    };

  });
