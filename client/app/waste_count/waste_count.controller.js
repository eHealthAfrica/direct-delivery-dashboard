'use strict';

angular.module('lmisApp')
  .controller('WasteCountCtrl', function($scope, Auth, Pagination, $filter, utility, Places, productTypes, wasteCounts) {
    var rows = wasteCounts;

    $scope.currentUser = Auth.getCurrentUser();
    $scope.pagination = new Pagination();
    $scope.productTypes = productTypes;
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.totals = [];
    $scope.places = null;
    $scope.showDetails = false;

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

    $scope.showDetail = function(place) {
      var prop = Places.propertyName($scope.place.columnTitle.toLowerCase());

      if (place === undefined) {
        $scope.showDetails = false;
      }
      else if ($scope.showDetails && $scope.search.facility[prop] === place) {
        $scope.showDetails = false;
      }
      else {
        $scope.search.facility = {};
        $scope.search.facility[prop] = place;
        $scope.showDetails = true;
      }
    };

    $scope.place = {
      type: '',
      columnTitle: '',
      search: ''
    };

    $scope.from = {
      opened: false,
      date: moment().startOf('day').subtract(30, 'days').toDate(),
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

      if ($scope.place.search.length) {
        $scope.search = {};
        if (angular.isUndefined($scope.search.facility)) {
          $scope.search.facility = {};
        }
        $scope.search.facility[filterBy] = $scope.place.search;
        $scope.search.created = $scope.from.date;
      }

      utility.placeDateFilter(rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date).forEach(function(row) {
        var key = row.facility[groupBy];
        totals[key] = totals[key] || {
          place: key,
          values: {}
        };

        row.reasons.forEach(function(reason) {
          var code = reason.productType;
          totals[key].values[code] = (totals[key].values[code] || 0) + reason.value;
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
      $scope.filteredRows = $filter('filter')(rows, $scope.search, function(actual, expected) {
        var matches = true;
        Object.keys(expected).some(function(key) {
          if (angular.isArray(actual)) {
            actual.some(function(actualKey) {
              if (actualKey[key] === undefined || actualKey[key].toLowerCase().indexOf(expected[key].toLowerCase()) < 0) {
                matches = false;
                return true;
              }
            });
          }
          else if (actual[key] === undefined || actual[key].toLowerCase().indexOf(expected[key].toLowerCase()) < 0) {

            matches = false;
            return true;
          }
          return false;
        });

        if (angular.isDate(actual) || angular.isDate(expected)) {
          var date = moment(Date.parse(actual));
          if ($scope.place.search.length) {
            matches = ((date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date)) &&
                       (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date)));
          }
          else {
            matches = date.isSame(expected, 'day');
          }
        }

        return matches;
      });
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    $scope.updateTotals();
    updateFilteredRows();
  });
