'use strict';

angular.module('lmisApp')
  .controller('WasteCountCtrl', function($scope, Auth, Pagination, $filter, utility, Places, productTypes, wasteCounts) {
    var rows = wasteCounts;

    $scope.currentUser = Auth.getCurrentUser();
    $scope.pagination = new Pagination();
    $scope.productTypes = productTypes;
    $scope.filteredRows = [];
    $scope.totals = [];
    $scope.places = null;

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

    $scope.getPlaces = function(filter) {
      $scope.places = new Places($scope.place.type, filter);

      return $scope.places.promise;
    };

    $scope.update = function() {
      var totals = {};
      var filterBy = Places.propertyName($scope.place.type);
      var subType = $scope.place.type === Places.FACILITY ? Places.FACILITY : Places.subType($scope.place.type);
      var groupBy = Places.propertyName(subType || $scope.currentUser.access.level);
      var columnTitle = Places.typeName(subType || $scope.currentUser.access.level);

      $scope.filteredRows = utility.placeDateFilter(rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date);
      $scope.filteredRows.forEach(function(row) {
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

      $scope.pagination.totalItems = $scope.filteredRows.length;
    };

    $scope.update();
  });
