'use strict';

angular.module('lmisApp')
  .controller('WasteCountCtrl', function($q, $scope, Auth, wasteCountFactory, Pagination, $filter, utility, Places, ProductType, Facility) {
    var rows = [];

    $scope.currentUser = Auth.getCurrentUser();
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.totals = [];
    $scope.productTypes = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.places = null;
    $scope.showDetails = false;

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

    $scope.showDetail = function(place) {
      var prop = Places.propertyName($scope.place.columnTitle.toLowerCase());

      if (place === undefined) {
        $scope.showDetails = false;
      }
      else if ($scope.showDetails && $scope.search.facility[prop] === place) {
        $scope.showDetails = false;
      }
      else {
        $scope.search.facility = {};
        $scope.search.facility[prop] = place;
        $scope.showDetails = true;
      }
    };

    $scope.place = {
      type: '',
      columnTitle: '',
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

        (Object.keys(row.wasteCount)).forEach(function(code) {
          totals[key].values[code] = (totals[key].values[code] || 0) + row.wasteCount[code];
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
    };

    $scope.$watch('search', function() {
      updateFilteredRows();
    }, true);

    function updateFilteredRows() {
      $scope.filteredRows = $filter('filter')(rows, $scope.search, utility.objectComparator);
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    $q.all([wasteCountFactory.getFormatted(), ProductType.codes()])
      .then(function(response) {
        rows = response[0];
        $scope.productTypes = response[1];

        $scope.updateTotals();
        updateFilteredRows();
      })
      .catch(function(reason) {
        $scope.error = true;
        console.log(reason);
      })
      .finally(function() {
        $scope.loading = false;
      });
  });
