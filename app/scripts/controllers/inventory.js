'use strict';

angular.module('lmisApp')
  .controller('InventoryCtrl', function ($scope, $q, $filter, utility, Places, ProductType, ProductCategory, Facility, stockCount) {
    var rows = [];

    $scope.loading = true;
    $scope.error = false;
    $scope.places = null;
    $scope.productTypes = [];
    $scope.totals = [];

    $scope.place = {
      type: Places.STATE,
      columnTitle: 'LGA',
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

    $scope.getStyle = function (name) {
      return ProductCategory.getStyle(name);
    };

    $scope.updateTotals = function () {
      var summary = {};
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
              summary[code] = (summary[code] || 0) + unopened.count;
            });
          });
      }

      $scope.place.columnTitle = columnTitle;

      $scope.totals = Object.keys(totals).map(function (key) {
        var item = totals[key];
        return {
          place: item.place,
          values: $scope.productTypes.map(function (productType) {
            return (item.values[productType.code] || 0);
          })
        };
      });

      $scope.summary = $scope.productTypes.map(function (productType) {
        return (summary[productType.code] || 0);
      });
    };

    $q.all([ProductType.all(), ProductCategory.all(), stockCount.all()])
      .then(function (res) {
        var types = res[0];
        var categories = res[1];
        var latestStockCounts = stockCount.latest(res[2]);

        var productTypes = utility
          .values(types)
          .map(function (p) {
            var style = categories[p.category];
            if (angular.isObject(style)) {
              style = ProductCategory.getStyle(style.name);
            } else {
              style = '';
            }
            return {
              code: p.code,
              style: style
            };
          });

        $scope.productTypes = $filter('orderBy')(productTypes, ['style', 'code']);

        stockCount.resolveUnopened(latestStockCounts)
          .then(function (resolved) {
            rows = resolved;

            var startState = '';

            rows.forEach(function (row) {
              if (!startState.length || (row.facility.state != Facility.unknown.state && row.facility.state < startState))
                startState = row.facility.state;
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
      .catch(function (err) {
        $scope.loading = false;
        console.error(err);
      });
  });
