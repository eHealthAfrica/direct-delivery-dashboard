'use strict';

angular.module('lmisApp')
		.service('Report', function($rootScope, $http, utility) {

			var _this = this;

			var URL = '/api/report';
			var allPromise = null;

			$rootScope.$on('currentUserChanged', function() {
				allPromise = null;
			});

			_this.getWithin = function(startDate, endDate){
				var param = '?startDate='+ startDate +'&endDate=' + endDate;
				return $http.get(URL + param)
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
              var zones = Object.keys(report.activeZones).sort(function(r1, r2){
	              if ( r1[0] < r2[0] )
		              return -1;
	              if ( r1[0] > r2[0])
		              return 1;
	              return 0;
              });
							for(var i in zones){
								var zone  = zones[i];
								chartData[0].values.push([ utility.capitalize(zone), report.cceBreakdown[zone] ]);
								chartData[1].values.push([ utility.capitalize(zone), 52 ]);//TODO: replace with stock to plan when completed
								chartData[2].values.push([ utility.capitalize(zone), report.reporting[zone] ]);
							}

							return chartData;
						});
			};

		});
