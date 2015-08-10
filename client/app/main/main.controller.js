'use strict';

angular.module('lmisApp')
		.controller('MainCtrl', function ($scope, Auth, productTypes, stockOuts) {
			$scope.currentUser = Auth.getCurrentUser();
      $scope.productTypes = productTypes;
      $scope.stockOuts = stockOuts;
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
				paginationPageSizes: [initialPaginationSize],
				paginationPageSize: initialPaginationSize,
				minRowsToShow: initialPaginationSize,
				columnDefs: [
					{field: 'zone', name: 'Zone'},
					{field: 'lga', name: 'LGA'},
					{field: 'facility', name: 'Facility'}
				]
			};
			$scope.gridOptions.data = [];

			//non-reporting table options
			$scope.lateGridOption = angular.copy($scope.gridOptions);
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
		});
    $scope.working = true;
    $scope.stockReports = {
      noReports: [],
      lateReports: [],
      total: ''
    };
    facilityReports.load()
      .then(function(response){
        $scope.stockReports.total = response.length;
        for(var i in response){
          if(response[i].isNonReporting){
            $scope.stockReports.noReports.push(response[i])
          }else{
            if(response[i].daysFromLastCountDate > 7){
              $scope.stockReports.lateReports.push(response[i])
            }
          }
        }
        $scope.working = false;
      })
      .catch(function(err){
        console.log(err);
      });
  })
  .controller('MainStockOutReport', function($scope, $filter, utility, Auth, Pagination, Places) {
    var rows = $scope.stockOuts;

    $scope.currentUser = Auth.getCurrentUser();
    //$scope.productTypes = productTypes;
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

    $scope.place = {
      type: 'ward',
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
      var stockOutExport = [];
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

      stockOutExport = $filter('orderBy')(stockOutExport, ['-created', 'product']);

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
      $scope.export = stockOutExport;
    };

    $scope.update();
  });
