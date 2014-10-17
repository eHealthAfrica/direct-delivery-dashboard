'use strict';

angular.module('lmisApp')
  .controller('LedgerCtrl', function($scope, Auth, Pagination, $filter, Places, bundleLines, productTypes) {
    var rows = bundleLines;

    $scope.currentUser = Auth.getCurrentUser();
    $scope.productTypes = productTypes;
    $scope.pagination = new Pagination();
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.ledger = {filterType: 'Incoming Bundle'};
    $scope.totals = [];

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

    $scope.created = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.receivedOn = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.expiryDate = {
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
      var filterType = angular.isUndefined($scope.ledger.filterType) ? 'Incoming Bundle' : $scope.ledger.filterType;

      var search = $scope.place.search.toLowerCase();
      rows
        .filter(function(row) {
          var date = moment(row.created);
          var include = true;

          if (include && search && filterBy) {
            var placeName = filterType === 'Incoming Bundle' ? row.receivingFacilityObject[filterBy] : row.sendingFacilityObject[filterBy];
            if (placeName === undefined)
              return false;

            include = include && placeName && (placeName.toLowerCase() === search);
          }

          if (include && $scope.from.date)
            include = include && (date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date));

          if (include && $scope.to.date)
            include = include && (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date));

          return include;
        })
        .forEach(function(row) {
          var key = filterType === 'Incoming Bundle' ? row.receivingFacilityObject[groupBy] : row.sendingFacilityObject[groupBy];
          totals[key] = totals[key] || {
            place: key,
            values: {}
          };

          var code = row.productCode;
          totals[key].values[code] = (totals[key].values[code] || 0) + row.quantity;
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
      $scope.filteredRows = $filter('filter')(rows, $scope.search, function(actual, expected) {

        var matches = true;

        actual = !angular.isDate(actual) && angular.isDefined(actual) ? actual.toLowerCase() : actual.toJSON();
        expected = !angular.isDate(expected) && angular.isDefined(expected) ? expected.toLowerCase() : expected;

        if (actual === undefined || actual.indexOf(expected) < 0) {
          matches = false;
        }

        if (angular.isDate(actual) || angular.isDate(expected)) {
          var date = moment(Date.parse(actual));
          matches = date.isSame(expected, 'day');
        }

        return matches;
      });

      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    $scope.updateTotals();
    updateFilteredRows();
  });