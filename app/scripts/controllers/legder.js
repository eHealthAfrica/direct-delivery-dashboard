'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/ledger', {
        templateUrl: 'views/ledger.html',
        controller: 'ledgerCtrl'
      });
  })
  .controller('ledgerCtrl', function ($scope, $q, ledgerFactory, Pagination, $filter, Places, ProductType, Facility) {
    var rows = [];
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.ledger = {filterType: 'Incoming Bundle'};
    $scope.pagination = new Pagination();
    $scope.loading = true;
    $scope.error = false;
    $scope.productTypes = [];
    $scope.totals = [];

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

    $scope.created = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.receivedOn = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.expiryDate = {
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
      var filterType = angular.isUndefined($scope.ledger.filterType) ? 'Incoming Bundle' : $scope.ledger.filterType;
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

            var facilityName = filterType === 'Incoming Bundle' ? row.receivingFacilityObject[filterBy] : row.sendingFacilityObject[filterBy];
            if (facilityName === undefined) {
              return false;
            }
            return ((facilityName.toLowerCase() === search) &&
              (date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date)) &&
              (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date)))
          })
          .forEach(function (row) {
            var key = filterType === 'Incoming Bundle' ? row.receivingFacilityObject[groupBy] : row.sendingFacilityObject[groupBy];
            totals[key] = totals[key] || {
              place: key,
              values: {}
            };

            var code = row.productCode;
            totals[key].values[code] = (totals[key].values[code] || 0) + row.quantity;

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

    $q.all([ledgerFactory.getFormattedBundleLines(), ProductType.codes()])
      .then(function(response) {
        rows = response[0];
        $scope.productTypes = response[1];
        var startState = '';

        rows.forEach(function (row) {
          if (!startState.length || (row.receivingFacilityObject.state != Facility.unknown.state && row.receivingFacilityObject.state < startState))
            startState = row.receivingFacilityObject.state;
        });

        $scope.place.search = startState;
        $scope.updateTotals();

        updateFilteredRows();
        $scope.loading = false;
      })
      .catch(function(reason) {
        $scope.loading = false;
        $scope.error = true;
        console.log(reason);
      });


  });