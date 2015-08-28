'use strict';

angular.module('reports')
		.controller('DeliveryReportCtrl', function ($window, config, reportsService, log) {

			var vm = this;//viewModel

			vm.dateFormat = config.dateFormat;
			vm.stopOn = new Date();
			var ONE_MONTH = 2.62974e9;//milli secs
			var ONE_MONTH_BEFORE = vm.stopOn.getTime() - ONE_MONTH;
			vm.startFrom = new Date(ONE_MONTH_BEFORE);

			function openDatePicker($event) {
				$event.preventDefault();
				$event.stopPropagation();
				this.opened = true;
			}

			vm.start = {
				opened: false,
				open: openDatePicker
			};

			vm.stop = {
				opened: false,
				open: openDatePicker
			};

			vm.formatXAxis = function () {
				return function (d) {
					return $window.d3.time.format('%d %b %Y')(new Date(d));
				};
			};

			vm.zoneReport = [];
			vm.statusReport = {};

			vm.getReport = function () {
				reportsService.getByWithin('Kano', vm.startFrom, vm.stopOn)
						.then(function (res) {
							vm.zoneReport = res.zones;
							vm.statusReport = res.status;
							vm.exampleData = vm.getGraphData(res.dates);
						})
						.catch(function (err) {
							log.error('cumulativeReportErr', err);
						});
			};

			vm.getReport(); //call on init

			vm.getGraphData = function (dateStatusCounts) {
				var graphData = [
					{
						"key": "Success",
						"color": "green",
						"values": []
					},
					{
						"key": "Failed",
						"color": "red",
						"values": []
					},
					{
						"key": "Canceled",
						"color": "orange",
						"values": []
					}
				];
				var dsc;
				for(var date in dateStatusCounts){
					if(dateStatusCounts.hasOwnProperty(date)) {
						dsc = dateStatusCounts[date];
						graphData[0].values.push([new Date(date), dsc.success]);
						graphData[1].values.push([new Date(date), dsc.failed]);
						graphData[2].values.push([new Date(date), dsc.canceled]);
					}
				}
				return graphData;
			};

		});