'use strict';

angular.module('lmisApp')
  .controller('CCUBreakdownCtrl', function ($scope, $q, State, Zone, LGA, Ward, Facility, CCEI, ccuBreakdown) {
    $scope.rows = [];
    $scope.totals = [];
    $scope.units = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.loadingPlaces = false;

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

    $scope.getPlaces = function (value) {
      $scope.loadingPlaces = true;
      var service = State;
      switch (parseInt($scope.place.type)) {
        case 1:
          service = Zone;
          break;
        case 2:
          service = LGA;
          break;
        case 3:
          service = Ward;
          break;
        case 4:
          service = Facility;
          break;
      }

      return service.names(value)
        .finally(function () {
          $scope.loadingPlaces = false;
        }.bind(this));
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
        $scope.rows.forEach(function (row) {
          if (row[filterBy].toLowerCase() == search) {
            var key = row[groupBy];
            totals[key] = totals[key] || {
              place: key,
              values: {}
            };

            var date = moment(row.created);
            if ((date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date)) &&
              (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date))) {
              var value = totals[key].values[row.name] || 0;
              totals[key].values[row.name] = value + 1;
            }
          }
        });
      }

      $scope.place.columnTitle = columnTitle;
      $scope.totals = Object.keys(totals).map(function (key) {
        var item = totals[key];
        return {
          place: item.place,
          values: $scope.units.map(function (unit) {
            return (item.values[unit] || 0);
          })
        };
      });
    };

    $q.all([
        CCEI.names(),
        ccuBreakdown.all()
      ])
      .then(function (responses) {
        $scope.units = responses[0];

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
              name: row.name
            };
          });

        $scope.place.search = startState;
        $scope.updateTotals();
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  })
  .controller('StockOutCtrl', function ($scope, stockOut) {
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    stockOut.all()
      .then(function (rows) {
        $scope.rows = rows
          .filter(function (row) {
            return !!row.facility;
          })
          .map(function (row) {
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
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  })
  .controller('StockCountCtrl', function ($scope, stockcountUnopened) {
    $scope.rows = [];
    $scope.loading = true;
    $scope.error = false;

    stockcountUnopened.all()
      .then(function (rows) {
        $scope.rows = rows
          .filter(function (row) {
            return !!row.facility;
          })
          .map(function (row) {
            return {
              state: row.facility.state,
              zone: row.facility.zone,
              lga: row.facility.lga,
              ward: row.facility.ward,
              facility: row.facility.name,
              created: row.created,
              productType: row.productType,
              count: row.count
            };
          });

      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  });
