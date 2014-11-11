'use strict';

angular.module('lmisApp')
  .controller('StockOutCtrl', function($scope, $filter, utility, Auth, Pagination, Places, productTypes, stockOuts) {
    var rows = stockOuts;

    $scope.currentUser = Auth.getCurrentUser();
    $scope.productTypes = productTypes;
    $scope.pagination = new Pagination();
    $scope.filteredRows = [];
    $scope.totals = [];
    $scope.places = null;
    $scope.getFileName = utility.getFileName;
    $scope.csvHeader = [
      'State',
      'Zone',
      'LGA',
      'Ward',
      'Facility',
      'Contact',
      'Phone',
      'Record Date',
      'Product',
      'Stock Level'
    ];

    var stockOutExport = [];

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

    $scope.update = function() {
      var totals = {};
      var filterBy = Places.propertyName($scope.place.type);
      var subType = $scope.place.type === Places.FACILITY ? Places.FACILITY : Places.subType($scope.place.type);
      var groupBy = Places.propertyName(subType || $scope.currentUser.access.level);
      var columnTitle = Places.typeName(subType || $scope.currentUser.access.level);

      $scope.filteredRows = utility.placeDateFilter(rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date);
      $scope.filteredRows.forEach(function(row) {
        stockOutExport.push({
          state: row.facility.state,
          zone: row.facility.zone,
          lga: row.facility.lga,
          ward: row.facility.ward,
          facility: row.facility.name,
          contactName: row.facility.contact.name,
          contactPhone: row.facility.contact.oldphone,
          created: row.created,
          product: row.productType,
          stockLevel: row.stockLevel
        });
        var key = row.facility[groupBy];
        totals[key] = totals[key] || {
          place: key,
          values: {}
        };

        var value = totals[key].values[row.productType] || 0;
        totals[key].values[row.productType] = value + 1;
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

      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
      $scope.export = stockOutExport;
    };

    $scope.update();
  });
