'use strict';

angular.module('lmisApp')
		.controller('MainCtrl', function ($scope, Auth, SETTINGS, Report, utility) {
			$scope.currentUser = Auth.getCurrentUser();
			$scope.mediumDateFormat = SETTINGS.mediumDate;
			$scope.isLoadingGraphData = true;
			$scope.weeklySituationReport = [];

			var prvWKRange = utility.getPreviousWeekRange();

			$scope.from = {
				opened: false,
				date: utility.getFullDate(prvWKRange.startDate),
				open: function($event) {
					$event.preventDefault();
					$event.stopPropagation();

					this.opened = true;
				}
			};

			$scope.to = {
				opened: false,
				date: utility.getFullDate(prvWKRange.endDate),
				open: function($event) {
					$event.preventDefault();
					$event.stopPropagation();

					this.opened = true;
				}
			};

			$scope.updateGraph = function(){
				$scope.isLoadingGraphData = true;
				Report.getWithin(utility.getFullDate($scope.from.date), utility.getFullDate($scope.to.date))
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
			};

			$scope.updateGraph(); //call on Ctrl start up
		})
		.controller('WeeklyReportGraphCtrl', function ($scope, SETTINGS, $window) {

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
      var reports = facilityReports.reportingConstants;
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
        .then(function (response){
          var stockCountSummaries = response.summaries;
          $scope.stockReports.total = stockCountSummaries.length;
          for(var i in stockCountSummaries){
            if(stockCountSummaries[i].reportingStatus === reports.NON_REPORTING){
              $scope.stockReports.noReports.push(stockCountSummaries[i])
            }else if (stockCountSummaries[i].reportingStatus === reports.DELAYING_REPORT){
              $scope.stockReports.lateReports.push(stockCountSummaries[i]);
            }
          }
          $scope.lateGridOption.data = $scope.stockReports.lateReports;
          $scope.gridOptions.data = $scope.stockReports.noReports;
          $scope.working = false;
        })
        .catch(function(err){
          console.log(err);
        });
		});
