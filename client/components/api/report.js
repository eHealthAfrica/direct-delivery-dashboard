'use strict';

angular.module('lmisApp')
		.service('Report', function($rootScope, $http, $q) {

			var _this = this;

			var URL = '/api/report';
			var allPromise = null;

			$rootScope.$on('currentUserChanged', function() {
				allPromise = null;
			});

			_this.getWithin = function(startDate, endDate){
				return $http.get(URL)
						.then(function(res){
							var report = res.data;
							var chartData = [
								{
									"key": "Functional CCE",
									"color": "#72BCD4",
									"values": []
								},
								{
									"key": "Stocked To Plan",
									"color": "#66B266",
									"values": []
								},
								{
									"key": "Reporting",
									"color": "#937e83",
									"values": []
								}
							];

							for(var zone in report.activeZones){
								chartData[0].values.push([ zone, report.cceBreakdown[zone] ]);
								chartData[1].values.push([ zone, 52 ]);//TODO: replace with stock to plan when completed
								chartData[2].values.push([ zone, report.reporting[zone] ]);
							}

							return chartData;
						});
			};

		});
