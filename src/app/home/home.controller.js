'use strict';

angular.module('directDeliveryDashboard')
		.controller('HomeCtrl', function(DELIVERY_STATUS, $window, roundReport) {

			console.log(roundReport);

			var vm = this; //view models
			vm.roundReport = roundReport;

			vm.onTime = [];
			if(roundReport.onTime || roundReport.behindTime > 0){
				vm.onTime = [
					{ key: 'Behind Time', y: roundReport.behindTime, color: 'orange' },
					{ key: 'On Time', y: roundReport.onTime, color: 'green' }
				];
			}


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

      vm.selectedRound = '';
			vm.roundCodes = [ 'KN-21-2015', 'KN-22-2015', 'KN-23-2015' ];

			vm.roundStatus = [
				{
					"key": "Success",
					"color": "green",
					"values": [
						[ "Bichi" , 38 ],
						[ "Nasarawa" , 40 ],
						[ "Rano" , 25 ],
						[ "Wudil" , 44 ]
					]
				},
				{
					"key": "Canceled",
					"color": "orange",
					"values": [
						[ "Bichi" , 2 ],
						[ "Nasarawa" , 0 ],
						[ "Rano" , 1 ],
						[ "Wudil" , 0 ]
					]
				},
				{
					"key": "Failed",
					"color": "red",
					"values": [
						[ "Bichi" , 3 ],
						[ "Nasarawa" , 2 ],
						[ "Rano" , 10 ],
						[ "Wudil" , 5 ]
					]
				},
				{
					"key": "Upcoming",
					"color": "grey",
					"values": [
						[ "Bichi" , 3 ],
						[ "Nasarawa" , 2 ],
						[ "Rano" , 10 ],
						[ "Wudil" , 5 ]
					]
				}
			];

			vm.roundOff = function() {
				return function(d) {
					return $window.d3.round(d);
				};
			};

			vm.margin = { left:0, top:0, bottom:0, right:0};

			var colorArray = ['grey', 'green', '#CC0000', '#FF6666', '#FF3333', '#FF6666', '#FFE6E6'];
			vm.colorFunction = function() {
				return function(d, i) {
					return colorArray[i];
				};
			};

		});
