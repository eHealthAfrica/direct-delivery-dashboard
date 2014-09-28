'use strict';

angular.module('lmisApp')
  .controller('WasteCountCtrl', function($scope, $filter, utility, Auth, Pagination, Facility, wasteCountFactory) {
    var rows = [];

    $scope.currentUser = Auth.getCurrentUser();
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.loading = true;
    $scope.error = false;
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

    $scope.$watch('search', function() {
      updateFilteredRows();
    }, true);

    function updateFilteredRows() {
      $scope.filteredRows = $filter('filter')(rows, $scope.search, utility.objectComparator);
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    wasteCountFactory.getFormatted()
      .then(function(formattedWasteCount) {
        rows = formattedWasteCount;
        updateFilteredRows();
        $scope.loading = false;
      })
      .catch(function(reason) {
        $scope.loading = false;
        $scope.error = true;
        console.log(reason);
      });
  });
