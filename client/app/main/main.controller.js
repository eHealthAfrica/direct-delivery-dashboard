'use strict';

angular.module('lmisApp')
		.controller('MainCtrl', function ($scope, Auth, SETTINGS, Report, utility, $rootScope) {
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
        $rootScope.$broadcast('updateView', {
          from: $scope.from.date,
          to: $scope.to.date
        });
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
				enableColumnMenus: false,
				enableFiltering: true,
				paginationPageSizes: [initialPaginationSize, 25, 50, 100],
				paginationPageSize: initialPaginationSize,
				minRowsToShow: initialPaginationSize,
				columnDefs: [
					{field: 'zone', name: 'Zone', sortable: false },
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

      $scope.$on('updateView', function(){
        $scope.working = true;
        return loadReports();
      });

      function loadReports(){

        $scope.stockReports.noReports = [];
        $scope.stockReports.lateReports = [];

        return facilityReports.load($scope.from.date, $scope.to.date)
          .then(function (response){
            var stockCountSummaries = response.summaries;
            $scope.stockReports.total = stockCountSummaries.length;
            for(var i in stockCountSummaries){
              if(stockCountSummaries[i].reportingStatus === reports.NON_REPORTING){
                $scope.stockReports.noReports.push(stockCountSummaries[i]);
                console.log(stockCountSummaries[i]);
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
      }

      loadReports();

		})
  .controller('CCEBreakdownReportCtrl', function ($scope, utility, $rootScope, Report) {
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

    $scope.tooltip = function () {
      return function(key, x) {
        return key + ': ' + parseInt(x, 10);
      }
    };

    function setChartData(response) {
      $scope.breakdownChartData = [
        {key: 'Broken', y: response.broken},
        {key: 'Working', y: response.fixed}
      ];
      $scope.isLoadingCCEChart = false;
    }

    function getCCEReportWithin() {
      $scope.isLoadingCCEChart = true;
      Report.getCCEReportWithin(utility.getFullDate($scope.from.date), utility.getFullDate($scope.to.date))
        .then(setChartData)
        .catch(function (reason) {
          $scope.isLoadingCCEChart = false;
          console.log(reason);
        })
    }
    getCCEReportWithin();
    $rootScope.$on('updateView', function (event, data) {
      $scope.to.date = data.to;
      $scope.from.date = data.from;
      getCCEReportWithin();
    });


  })
  .controller('MainStockOutReportCtrl', function ($scope, $q, ProductType, stockOut, $window, utility, $rootScope) {
    var serverResponse = {};
    $scope.isLoadingStockOutData = true;

    function productTypeToObject(list) {
      var productTypes = {};
      for (var i = 0; i < list.length; i++) {
        productTypes[list[i]] = 0;
      }

      return productTypes;
    }

    function toChart(object, groupedByProducts) {
      function formatObjectToChatValues(object, groupedByProducts) {
        var chartValues = [];
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            var value = 0;
            if (groupedByProducts.hasOwnProperty(key)) {
              value = (object[key]/groupedByProducts[key])*100;
            }
            chartValues.push([key, value]);
          }
        }
        return chartValues;
      }

      var chartData = [];
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          chartData.push( {
            key: key,
            values: formatObjectToChatValues(object[key], groupedByProducts)
          });
        }

      }

      return chartData
    }

    function groupByProduct(group, row) {
      if (!group.hasOwnProperty(row.productType)) {
        group[row.productType] = 0;
      }

      group[row.productType] ++;

      return group;
    }

    function groupStockOut(rows, productTypes) {
      function setType(groups, row, type) {

        var altName = type === 'facility' ? 'name' : type;
        var typeName = row.facility[altName];
        if (!groups[type][typeName]) {
          var productCount = angular.copy(productTypes);
          productCount[row.productType] ++;
          groups[type][typeName] = productCount;
        } else {
          if (!groups[type][typeName][row.productType]) {
            groups[type][typeName][row.productType] = 1;
          } else {
            groups[type][typeName][row.productType] ++;
          }
        }
        return groups[type];
      }
      var groups = {
        facility: {},
        ward: {},
        lga: {},
        zone: {},
        products: {}
      };

      for (var i = 0; i < rows.length; i++) {
        var dateFrom = utility.getFullDate($scope.from.date);
        var dateTo = utility.getFullDate($scope.to.date);
        var created =  utility.getFullDate(rows[i].created);
        if (created >= dateFrom && created <= dateTo) {
          groups.facility = setType(groups, rows[i], 'facility');
          groups.ward = setType(groups, rows[i], 'ward');
          groups.lga = setType(groups, rows[i], 'lga');
          groups.zone = setType(groups, rows[i], 'zone');
          groups.products = groupByProduct(groups.products, rows[i]);
        }

      }

      return groups;
    }

    function setChart(response) {
      if (response) {
        serverResponse = response;
      }
      var productTypesObject = productTypeToObject(serverResponse.productTypes);
      var groupedStockOut = groupStockOut(serverResponse.stockOuts, productTypesObject);
      $scope.stoutOutChartData = toChart(groupedStockOut.zone, groupedStockOut.products);
      $scope.isLoadingStockOutData = false;
    }

    var promises = {
      productTypes: ProductType.codes(),
      stockOuts: stockOut.byDate()
    };

    $q.all(promises)
      .then(setChart)
      .catch(function () {
        $scope.isLoadingStockOutData = false;
      });

    $scope.roundYAxis = function () {
      return function (d) {
        return Math.round(d)+'%';
      };
    };

    $rootScope.$on('updateView', function (event, data) {
      $scope.to.date = data.to;
      $scope.from.date = data.from;
      setChart();
    });

  });
