'use strict';

angular.module('lmisApp')
  .controller('StockCountCtrl', function($scope, $filter, $routeParams, utility, Auth, Pagination, Places, stockCounts, productTypes) {
    var rows = stockCounts;

    $scope.currentUser = Auth.getCurrentUser();
    $scope.productTypes = productTypes;
    $scope.pagination = new Pagination();
    $scope.filteredRows = [];
    $scope.totals = [];
    $scope.places = null;
    $scope.getFilename = utility.getFileName;
    $scope.csvHeader = [
      'State',
      'Zone',
      'LGA',
      'Ward',
      'Facility',
      'Contact Name',
      'Contact Phone',
      'Product',
      'Count',
      'Due Date',
      'Record Date',
      'Modified Date'
    ];

    $scope.place = {
      type: '',
      columnTitle: '',
      search: ''
    };

    if ($routeParams.facility) {
      $scope.place = {
        type: Places.FACILITY,
        search: $routeParams.facility
      };
    }

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
      var unopenedExport = [];
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

        row.unopened.forEach(function(unopened) {
          unopenedExport.push({
            state: row.facility.state,
            zone: row.facility.zone,
            lga: row.facility.lga,
            ward: row.facility.ward,
            facility: row.facility.name,
            contactName: row.facility.contact.name,
            contactPhone: row.facility.phone,
            product: unopened.productType.code,
            count: unopened.count,
            countDate: row.countDate,
            created: row.created,
            modified: row.modified
          });

          var code = unopened.productType.code;
          totals[key].values[code] = (totals[key].values[code] || 0) + unopened.count;
        });
      });

      unopenedExport = $filter('orderBy')(unopenedExport, ['-created', 'product']);

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
      $scope.export = unopenedExport;
    };

    $scope.update();
  });
