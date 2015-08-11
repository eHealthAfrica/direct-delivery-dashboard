'use strict';

angular.module('lmisApp')
  .controller('MainCtrl', function ($scope, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
  })
  .controller('WeeklyReportGraphCtrl', function ($scope, $window, Report, utility) {
    $scope.weeklySituationReport = [];
    var prvWKRange = utility.getPreviousWeekRange();
    $scope.startDate = utility.getFullDate(prvWKRange.startDate);
    $scope.endDate = utility.getFullDate(prvWKRange.endDate);
    $scope.isLoadingGraphData = true;

    Report.getWithin($scope.startDate, $scope.endDate)
      .then(function (res) {
        $scope.weeklySituationReport = res;
      })
      .catch(function (err) {
        $scope.weeklySituationReport = [];
        //TODO: alert via growl and set $scope.weeklySituationReport to empty array
        console.error(err);
      })
      .finally(function () {
        $scope.isLoadingGraphData = false;
      });

    $scope.roundOff = function () {
      return function (d) {
        return $window.d3.format('%')(d);
      };
    };

    $scope.yValue = function () {
      return function (d) {
        return (d[1] / 100);
      };
    };

  })
  .controller('MainStockReport', function ($scope, facilityReports) {
    $scope.working = true;
    $scope.stockReports = {
      noReports: [],
      lateReports: [],
      total: ''
    };

    //silent reporting table options
    var initialPaginationSize = 10;
    $scope.gridOptions = {
      enableFiltering: true,
      paginationPageSizes: [initialPaginationSize, 25, 50, 100],
      paginationPageSize: initialPaginationSize,
      minRowsToShow: initialPaginationSize,
      columnDefs: [
        {field: 'zone', name: 'Zone'},
        {field: 'lga', name: 'LGA'},
        {field: 'facility', name: 'Facility'}
      ],
      onRegisterApi: function(gridApi){
        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
          $scope.gridOptions.minRowsToShow = pageSize;
        });
      }
    };
    $scope.gridOptions.data = [];

    //non-reporting table options
    $scope.lateGridOption = angular.copy($scope.gridOptions);
    $scope.lateGridOption.onRegisterApi = function (gridApi) {
      gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
        $scope.lateGridOption.minRowsToShow = pageSize;
      });
    };
    $scope.lateGridOption.data = [];

    facilityReports.load()
      .then(function (response) {
        $scope.stockReports.total = response.length;
        for (var i in response) {
          if (response[i].isNonReporting) {
            $scope.stockReports.noReports.push(response[i])
          } else {
            if (response[i].daysFromLastCountDate > 7) {
              $scope.stockReports.lateReports.push(response[i])
            }
          }
        }
        $scope.lateGridOption.data = $scope.stockReports.lateReports;
        $scope.gridOptions.data = $scope.stockReports.noReports;
        $scope.working = false;
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .controller('CCEBreakdownReport', function ($scope, $q, ccuBreakdown, AppConfig) {
    $scope.isLoadingCCEChart = true;

    function sortStatus(a, b) {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    }

    function groupCCEBreakdown(rows) {
      var facilities = {};

      for (var i = 0; i < rows.length; i++) {
        if (rows[i].facility) {
          if (!facilities[rows[i].facility._id]) {
            facilities[rows[i].facility._id] = rows[i].ccuStatus;
          } else {
            facilities[rows[i].facility._id].concat(rows[i].ccuStatus);
          }
        }
      }

      return facilities;
    }

    function setChartData(response) {
      var byFacilities = groupCCEBreakdown(response.ccuBreakdown);
      var appConfig = response.appConfig;
      var chartData = {
        broken: 0,
        fixed: 0
      };

      for (var i = 0; i < appConfig.length; i++) {
        var key = appConfig[i].facility._id;
        if (byFacilities.hasOwnProperty(key)) {
          byFacilities[key].sort(sortStatus);
          var status = byFacilities[key][0] ? byFacilities[key][0].status : 1;
          if (status === 0) {
            chartData.broken ++;
          } else {
            chartData.fixed ++;
          }
        } else {
          chartData.fixed ++;
        }
      }

      $scope.breakdownChartData = [
        {key: 'Broken', y: chartData.broken},
        {key: 'Working', y: chartData.fixed}
      ];

      $scope.isLoadingCCEChart = false;
    }

    $q.all({ccuBreakdown: ccuBreakdown.byDate(), appConfig: AppConfig.all()})
      .then(setChartData)
      .catch(function (reason) {
        $scope.isLoadingCCEChart = false;
        console.log(reason);
      });

    $scope.xFunction = function() {
      return function(d) {
        return d.key;
      };
    };

    $scope.yFunction = function() {
      return function(d) {
        return d.y;
      };
    };

  });
