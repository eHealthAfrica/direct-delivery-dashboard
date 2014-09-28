'use strict';

angular.module('lmisApp')
  .controller('StockOutCtrl', function($scope, $q, $filter, utility, Auth, Pagination, Places, ProductType, stockOut) {
    $scope.currentUser = Auth.getCurrentUser();
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
      type: '',
      columnTitle: '',
      search: ''
    };

    $scope.from = {
      opened: false,
      date: moment().startOf('day').subtract(7, 'days').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.to = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.getPlaces = function(filter) {
      $scope.places = new Places($scope.place.type, filter);

      return $scope.places.promise;
    };

    $scope.updateTotals = function() {
      var totals = {};
      var filterBy = Places.propertyName($scope.place.type);
      var subType = $scope.place.type === Places.FACILITY ? Places.FACILITY : Places.subType($scope.place.type);
      var groupBy = Places.propertyName(subType || $scope.currentUser.access.level);
      var columnTitle = Places.typeName(subType || $scope.currentUser.access.level);

      utility.placeDateFilter($scope.rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date).forEach(function(row) {
        var key = row.facility[groupBy];
        totals[key] = totals[key] || {
          place: key,
          values: {}
        };

        var value = totals[key].values[row.productType] || 0;
        totals[key].values[row.productType] = value + 1;
      });

      $scope.place.columnTitle = columnTitle;
      $scope.totals = Object.keys(totals).map(function(key) {
        var item = totals[key];
        return {
          place: item.place,
          values: $scope.productTypes.map(function(productType) {
            return (item.values[productType] || 0);
          })
        };
      });
    };

    $scope.$watch('search', function() {
      updateFilteredRows();
    }, true);

    function updateFilteredRows() {
      $scope.filteredRows = $filter('filter')($scope.rows, $scope.search, utility.objectComparator);
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    $q.all([
        ProductType.codes(),
        stockOut.byDate()
      ])
      .then(function(responses) {
        $scope.productTypes = responses[0];

        var rows = responses[1];
        $scope.rows = rows
          .filter(function(row) {
            return !!row.facility;
          });

        $scope.updateTotals();
        updateFilteredRows();
      })
      .catch(function() {
        $scope.error = true;
      })
      .finally(function() {
        $scope.loading = false;
      });
  });
