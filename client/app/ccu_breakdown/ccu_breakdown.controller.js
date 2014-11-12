'use strict';

angular.module('lmisApp')
  .controller('CCUBreakdownCtrl', function($scope, $filter, utility, Auth, Pagination, Places, cceis, ccuBreakdowns) {
    var rows = ccuBreakdowns;
    $scope.currentUser = Auth.getCurrentUser();
    $scope.pagination = new Pagination();
    $scope.filteredRows = [];
    $scope.places = null;
    $scope.broken = 0;
    $scope.fixed  = 0;
    $scope.units = cceis;
    $scope.search = {};
    $scope.totals = [];
    $scope.columnWithValues = {
      headers: [],
      columns: []
    };

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

    $scope.updateTotals = function() {
      var columnTotals = [];
      var collapse = [];
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
        var code = row.manufacturer + ' - ' + row.name;
        var value = totals[key].values[code] || 0;
        totals[key].values[code] = value + 1;
        columnTotals.push(code);
      });
      $scope.place.columnTitle = columnTitle;

      $scope.totals = Object.keys(totals).map(function(key) {
        var item = totals[key];
        var count = 0;
        return {
          place: item.place,
          values: $scope.units.map(function(unit) {
            if (columnTotals.indexOf(unit) === -1) {
              collapse.push(count);
            }
            count++;
            return (item.values[unit] || 0);
          })
        };
      });
      $scope.columnWithValues.columns = collapse;
      $scope.columnWithValues.headers = columnTotals;
    };

    $scope.getPlaces = function(filter) {
      $scope.places = new Places($scope.place.type, filter);

      return $scope.places.promise;
    };
    function setChartData(data){
      $scope.broken = 0;
      $scope.fixed  = 0;
      data.forEach(function(d){
        if(d.status === 0){
          $scope.broken = $scope.broken + 1;
        }else{
          $scope.fixed = $scope.fixed + 1;
        }
      });
      $scope.breakdownChartData = [
        {'key': 'broken', y : $scope.broken},
        {key: 'fixed', y: $scope.fixed}
      ]
    }

    $scope.update = function() {
      var filterBy = Places.propertyName($scope.place.type);

      $scope.filteredRows = utility.placeDateFilter(rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date);
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
      $scope.updateTotals();
      setChartData($scope.filteredRows);
    };

    $scope.update();

    $scope.xFunction = function() {
      return function(d) {
        return d.key;
      };
    }
    $scope.yFunction = function() {
      return function(d) {
        return d.y;
      };
    }
  });