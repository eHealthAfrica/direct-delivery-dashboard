'use strict';

angular.module('reports')
		.controller('DeliveryReportCtrl', function ($window, config) {

			var vm = this;//viewModel

			vm.dateFormat = config.dateFormat;
			vm.startFrom = new Date('2015-05-01');//TODO:set to least delivery date by default
			vm.stopOn = new Date();

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

			vm.formatXAxis = function() {
				return function(d){
					return $window.d3.time.format('%d %b %Y')(new Date(d));
				};
			};

			vm.exampleData = [
				{
					"key": "Success",
					"color": "green",
					"values": [
						[ 1430438400000, 0 ],
						[ 1431648000000, 300 ],
						[ 1434240000000, 550 ],
						[ 1435622400000, 800 ]
					]
				},
				{
					"key": "Failed",
					"color": "red",
					"values": [
						[ 1430438400000, 0 ],
						[ 1431648000000, 200 ],
						[ 1434240000000, 318 ],
						[ 1435622400000, 420 ]
					]
				},
				{
					"key": "Canceled",
					"color": "orange",
					"values": [
						[ 1430438400000, 0 ],
						[ 1431648000000, 15 ],
						[ 1434240000000, 30 ],
						[ 1435622400000, 55 ]
					]
				}
			];

		});