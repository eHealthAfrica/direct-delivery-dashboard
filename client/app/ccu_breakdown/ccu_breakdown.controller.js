'use strict';

angular.module('lmisApp')
  .controller('CCUBreakdownCtrl', function($scope, $filter, utility, Auth, Pagination, Places, ccuBreakdowns) {
    var rows = ccuBreakdowns;
    $scope.currentUser = Auth.getCurrentUser();
    $scope.pagination = new Pagination();
    $scope.filteredRows = [];
    $scope.places = null;
    $scope.broken = 0;
    $scope.fixed  = 0;

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
      setChartData($scope.filteredRows);
    };

    $scope.update();
    function updateChartData(){
      $scope.breakdownChartData = [
      { key: "Broken", y: $scope.broken, color:'#f33' },
      { key: "Fixed", y: $scope.fixed, color:'#3f3' }
      ];
      console.log($scope.broken + "-" + $scope.fixed);
    }
    function setChartData(rows){
       rows.forEach(function(row){
          if(row.status === 1){
            $scope.fixed = $scope.fixed + 1;

          }else {
            $scope.broken = $scope.broken + 1;
          }

      })
      console.log($scope.broken);
      updateChartData();
    }
      $scope.xFunction = function(){
        return function(d) {
          return d.key;
        };
      }
      $scope.yFunction = function(){
        return function(d){
          return d.y;
        };
      }
 });