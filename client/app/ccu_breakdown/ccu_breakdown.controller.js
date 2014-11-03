'use strict';

angular.module('lmisApp')
  .controller('CCUBreakdownCtrl', function($scope, $filter, utility, Auth, Pagination, Places, ccuBreakdowns) {
    var rows = ccuBreakdowns;

    $scope.currentUser = Auth.getCurrentUser();
    $scope.pagination = new Pagination();
    $scope.filteredRows = [];
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

    $scope.update = function() {
      var filterBy = Places.propertyName($scope.place.type);

      $scope.filteredRows = utility.placeDateFilter(rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date);
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    };

    $scope.update();
  });