'use strict';

angular.module('lmisApp')
  .controller('CCUBreakdownCtrl', function ($scope, $q, $filter, Pagination, Places, CCEI, ccuBreakdown) {

    $scope.rows = [];
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.totals = [];
    $scope.units = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.places = null;

    $scope.$watch('search', function () {
      updateFilteredRows();
    }, true);

    function updateFilteredRows() {
      $scope.filteredRows = $filter('filter')($scope.rows, $scope.search);
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    $q.all([
      CCEI.names(),
      ccuBreakdown.byDate(),
      ccuBreakdown.all()
    ])
      .then(function (responses) {
        $scope.loading = true;
        $scope.units = responses[0];
        var cceStatus = ['Faulty', 'Fixed'];
        var cceFaults = ['Leaking', 'Broken Seal', 'No Power Supply', 'Others'];
        var rows = responses[2];
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
              name: row.ccuProfile.ModelName,
              manufacturer: row.ccuProfile.Manufacturer,
              status: row.ccuStatus.reverse()[0].status,
              statusText: cceStatus[row.ccuStatus.reverse()[0].status],
              lastFault: cceFaults[row.ccuStatus.reverse()[0].fault],
              contact: {
                name: row.facility.contact.name,
                email: row.facility.email,
                phone: row.facility.phone
              }
            };
          });

        //$scope.place.search = startState;
        //$scope.updateTotals();
        updateFilteredRows();
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  });
  /*.controller('CCUBreakdownCtrl', function($scope, $q, $filter, utility, Auth, Pagination, Places, CCEI, ccuBreakdown) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.rows = [];
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.totals = [];
    $scope.units = [];
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

        var value = totals[key].values[row.name] || 0;
        totals[key].values[row.name] = value + 1;
      });

      $scope.place.columnTitle = columnTitle;
      $scope.totals = Object.keys(totals).map(function(key) {
        var item = totals[key];
        return {
          place: item.place,
          values: $scope.units.map(function(unit) {
            return (item.values[unit] || 0);
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
        CCEI.names(),
        ccuBreakdown.byDate()
      ])
      .then(function(responses) {
        $scope.units = responses[0];

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
  });*/