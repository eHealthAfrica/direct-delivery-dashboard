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
				var param = [ '?startDate=', startDate, '&endDate=', endDate].join('');
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
							var zones = Object.keys(report.activeZones)
									.sort(function (r1, r2) {
										if (r1[0] < r2[0])
											return -1;
										if (r1[0] > r2[0])
											return 1;
										return 0;
									});
							var ONE_HUNDRED = 100;
							for(var i in zones){
								var zone = zones[i];
								var zoneTotal = report.activeZones[zone];
								var facility = (zoneTotal === 0 || zoneTotal === 1)? 'Facility' : 'Facilities';
								var zoneLabel  =  [ zones[i], '(', zoneTotal, facility, ')'].join(' ');
								chartData[0].values.push([ utility.capitalize(zoneLabel), report.cceBreakdown[zone] ]);

								var stp = ((report.stockToPlan[zone].STP / zoneTotal) * ONE_HUNDRED);
								chartData[1].values.push([ utility.capitalize(zoneLabel), stp]);

								chartData[2].values.push([ utility.capitalize(zoneLabel), report.reporting[zone] ]);
							}

							return chartData;
						});
			};

    this.getCCEReportWithin = function(startDate, endDate) {
      return utility.request(URL + '/cce-status', {startDate: startDate, endDate: endDate});
    }

		});
