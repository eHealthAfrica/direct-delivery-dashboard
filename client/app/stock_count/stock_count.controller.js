'use strict';

angular.module('lmisApp')
  .controller('StockCountCtrl', function($scope, $q, $filter, $routeParams, utility, Auth, Pagination, Places, ProductType, Facility, stockCount) {
    var rows = [];

    $scope.currentUser = Auth.getCurrentUser();
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

    if ($routeParams.facility) {
      $scope.search = {
        facility: {
          name: $routeParams.facility
        }
      };
    }

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

      utility.placeDateFilter(rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date).forEach(function(row) {
        var key = row.facility[groupBy];
        totals[key] = totals[key] || {
          place: key,
          values: {}
        };

        row.unopened.forEach(function(unopened) {
          var code = unopened.productType.code;
          totals[key].values[code] = (totals[key].values[code] || 0) + unopened.count;
        });
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
      $scope.filteredRows = $filter('filter')(rows, $scope.search, utility.objectComparator);
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    $q.all([
        ProductType.codes(),
        stockCount.all()
      ])
      .then(function(responses) {
        $scope.productTypes = responses[0];

        stockCount.resolveUnopened(stockCount.latest(responses[1]))
          .then(function(resolved) {
            rows = resolved;

            $scope.updateTotals();
            updateFilteredRows();
          })
          .catch(function() {
            $scope.error = true;
          })
          .finally(function() {
            $scope.loading = false;
          });
      })
      .catch(function() {
        $scope.loading = false;
        $scope.error = true;
      })
  });