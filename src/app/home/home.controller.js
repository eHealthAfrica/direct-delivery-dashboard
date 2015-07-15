'use strict';

angular.module('directDeliveryDashboard')
		.controller('HomeCtrl', function(DELIVERY_STATUS, $window, roundReport, deliveryRoundService, log, $scope) {

			var vm = this; //view models
			vm.selectedRound = '';
			vm.roundCodes = roundReport.roundInfo.roundCodes || [];
			vm.roundReport = roundReport;
			vm.onTime = [];

			//TODO: move to generate report service function
			if(roundReport.onTime || roundReport.behindTime > 0){
				vm.onTime = [
					{ key: 'Behind Time', y: roundReport.behindTime, color: 'orange' },
					{ key: 'On Time', y: roundReport.onTime, color: 'green' }
				];
			}

			vm.showReport = function () {
				deliveryRoundService.getReport(vm.selectedRound)
						.then(function (rndReport) {
							rndReport.deliveryRoundID = vm.selectedRound;
							vm.roundReport = rndReport;
							vm.setTimeline(vm.roundReport);
						})
						.catch(function (err) {
							var msg = [
								'Report for Round:',
								vm.selectedRound,
								'does not exist!'
							].join(' ');

							log.error('', err, msg);
						});
			};


			vm.onTimeColors = function() {
				return function(d) {
					return d.data.color;
				};
			};

			vm.xPieFunction = function(){
				return function(d) {
					return d.key;
				};
			};

			vm.yPieFunction = function(){
				return function(d){
					return d.y;
				};
			};

			vm.roundOff = function() {
				return function(d) {
					return $window.d3.round(d);
				};
			};

			vm.xAxisTickFormat_Time_Format = function(){
				return function(d){
					return d3.time.format('%d-%m-%y')(new Date(d))
				}
			};

			vm.setTimeline = function(rndReport){
				vm.data = [
					{
						name: 'Milestones',
						color: '#45607D',
						tasks: [
							{
								name: 'Progress',
								color: '#93C47D',
								from: vm.roundReport.timeline.startDate,
								to: vm.roundReport.timeline.markDate
							},
							{
								name: 'End',
								color: '#FF0000',
								from: vm.roundReport.timeline.endDate,
								to: vm.roundReport.timeline.endDate
							}
						]
					}
				];
			};

			vm.setTimeline(vm.roundReport);



			$scope.registerApi = function(api) {
				api.core.on.ready($scope, function () {
					// Call API methods and register events.
					api.data.on.change(vm.data, vm.data);
				});
			}


		});
