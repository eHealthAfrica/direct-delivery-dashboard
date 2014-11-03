'use strict';

angular.module('lmisApp')
  .controller('InventoryCtrl', function($scope, $filter, utility, Auth, Places, productTypes, stockCounts) {
    var rows = stockCounts.rows;
    var latestRows = stockCounts.latestRows;
    var xTickValues = [];

    $scope.currentUser = Auth.getCurrentUser();
    $scope.productTypes = productTypes;
    $scope.totalsHeaders = [''].concat(productTypes.map(function(type) {
      return type.code;
    }));

    $scope.title = 'Inventory';
    $scope.places = null;
    $scope.totals = [];
    $scope.chartData = [];

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
      if ($scope.place.type) {
        $scope.places = new Places($scope.place.type, filter);

        return $scope.places.promise;
      }
      else
        return [];
    };

    $scope.placeTypeName = function(type) {
      return Places.typeName(type);
    };

    $scope.updateFor = function(placeName) {
      if (!placeName || $scope.place.type == Places.FACILITY)
        return;

      $scope.place.type = Places.subType($scope.place.type) || $scope.currentUser.access.level;
      $scope.place.search = placeName;

      $scope.updateTotals();
    };

    $scope.formatDateAxisFunction = function() {
      return function(d) {
        return moment(d).format('YYYY-MM-DD');
      }
    };

    $scope.getXTickValues = function() {
      return function(d) {
        return xTickValues;
      }
    };

    $scope.updateTotals = function() {
      var summary = {};
      var totals = {};
      var chartData = {};
      var filterBy = Places.propertyName($scope.place.type);
      var subType = $scope.place.type === Places.FACILITY ? Places.FACILITY : Places.subType($scope.place.type);
      var groupBy = Places.propertyName(subType || $scope.currentUser.access.level);
      var columnTitle = Places.typeName(subType || $scope.currentUser.access.level);

      utility.placeDateFilter(latestRows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date).forEach(function(row) {
        var key = row.facility[groupBy];
        totals[key] = totals[key] || {
          place: key,
          values: {}
        };

        if (row.unopened) {
          row.unopened.forEach(function(unopened) {
            var code = unopened.productType.code;
            totals[key].values[code] = (totals[key].values[code] || 0) + unopened.count;
            summary[code] = (summary[code] || 0) + unopened.count;
          });
        }
      });

      var minDate = NaN;
      var maxDate = NaN;
      utility.placeDateFilter(rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date).forEach(function(row) {
        if (row.unopened) {
          row.unopened.forEach(function(unopened) {
            var code = unopened.productType.code;

            chartData[code] = chartData[code] || {};

            var date = moment(row.created).utc();
            if (date.isValid()) {
              date = date.startOf('day').toDate().getTime();

              if (isNaN(minDate) || minDate > date)
                minDate = date;

              if (isNaN(maxDate) || maxDate < date)
                maxDate = date;

              chartData[code][date] = (chartData[code][date] || 0) + unopened.count;
            }
          });
        }
      });

      var title = [];
      if ($scope.place.type) {
        if ($scope.place.search)
          title = [$scope.place.search, Places.typeName($scope.place.type)];
        else
          title = [Places.typeName($scope.place.type, true)];
      }

      title.push('Inventory');
      $scope.title = title.join(' ');

      $scope.summary = $scope.productTypes.map(function(productType) {
        return (summary[productType.code] || 0);
      });

      $scope.place.columnTitle = columnTitle;
      $scope.totalsHeaders[0] = columnTitle;

      var totalsData = Object.keys(totals).map(function(key) {
        var item = totals[key];
        var values = $scope.productTypes.map(function(productType) {
          return (item.values[productType.code] || 0);
        });

        return [item.place].concat(values);
      });

      // order here not in view because array is also used for CSV export
      $scope.totals = $filter('orderBy')(totalsData, '0');

      xTickValues = [];
      if (!isNaN(minDate) && !isNaN(maxDate)) {
        while (minDate <= maxDate) {
          xTickValues.push(minDate);
          minDate += 86400000;
        }
      }

      $scope.chartData = $scope.productTypes.map(function(productType) {
        var item = chartData[productType.code];
        var values = [];

        if (item) {
          values = Object.keys(item)
            .map(function(date) {
              return [parseInt(date), item[date]]
            })
            .sort(function(a, b) {
              if (a[0] < b[0]) return -1;
              if (a[0] > b[0]) return 1;
              return 0;
            });
        }

        return { key: productType.code, values: values };
      });
    };

    $scope.updateTotals();
  });
