'use strict';

angular.module('directDeliveryDashboard')
		.controller('HomeCtrl', function(DELIVERY_STATUS, $window, roundReport, deliveryRoundService, log) {

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
							vm.setTimeline();
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


			vm.setTimeline = function(){
				if(!vm.roundReport.timeline){
					return;
				}
				var endDateLastHour = 82799000;
				vm.scale = 'day';
				vm.data = [
					{
						name: 'Milestones',
						color: '#45607D',
						tasks: [
							{
								name: 'Progress',
								color: '#93C47D',
								from: vm.roundReport.timeline.startDate,
								to: new Date(vm.roundReport.timeline.markDate.getTime() + endDateLastHour),
								priority: 1 //enables progress to overlap end point
							},
							{
								name: 'End',
								color: '#FF0000',
								from: vm.roundReport.timeline.endDate,
								to: new Date(vm.roundReport.timeline.endDate.getTime() + endDateLastHour).toJSON(),
								priority: 0
							}
						]
					}
				];
			};

			vm.setTimeline();

		});
