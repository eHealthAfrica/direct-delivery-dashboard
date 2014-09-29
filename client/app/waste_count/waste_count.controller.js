'use strict';

angular.module('lmisApp')
  .controller('WasteCountCtrl', function($q, $scope, wasteCountFactory, Pagination, $filter, utility, Places, ProductType, Facility) {
    var rows = [];

    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.totals = [];
    $scope.productTypes = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.places = null;
    $scope.showDetails = false;

    $scope.showDetail = function(place) {
      if (place === undefined) {
        $scope.showDetails = false;
      }
      else if ($scope.showDetails && $scope.search.facility[$scope.place.columnTitle.toLowerCase()] === place) {
        $scope.showDetails = false;
      }
      else {
        $scope.search.facility = {};
        $scope.search.facility[$scope.place.columnTitle.toLowerCase()] = place;
        $scope.showDetails = true;
      }
    };

    $scope.place = {
      type: Places.STATE,
      columnTitle: 'Zone',
      search: ''
    };

    $scope.from = {
      opened: false,
      date: moment().startOf('day').subtract('days', 30).toDate(),
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
        $scope.search = {};
        if (angular.isUndefined($scope.search.facility)) {
          $scope.search.facility = {};
        }
        $scope.search.facility[filterBy] = search;
        $scope.search.created = $scope.from.date;
        rows
          .filter(function(row) {
            var date = moment(row.created);
            return ((row.facility[filterBy].toLowerCase() == search) &&
                    (date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date)) &&
                    (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date)))
          })
          .forEach(function(row) {
            var key = row.facility[groupBy];
            totals[key] = totals[key] || {
              place: key,
              values: {}
            };

            (Object.keys(row.wasteCount)).forEach(function(code) {
              totals[key].values[code] = (totals[key].values[code] || 0) + row.wasteCount[code];
            });
          });
      }

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


    $q.all([wasteCountFactory.getFormatted(), ProductType.codes()])
      .then(function(response) {
        rows = response[0];
        $scope.productTypes = response[1];

        var startState = '';

        rows.forEach(function(row) {
          if (!startState.length || (row.facility.state != Facility.unknown.state && row.facility.state < startState))
            startState = row.facility.state;
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
