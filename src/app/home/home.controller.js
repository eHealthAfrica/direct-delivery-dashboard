'use strict';

angular.module('directDeliveryDashboard')
		.controller('HomeCtrl', function(DELIVERY_STATUS, $window) {

			var vm = this; //view model
      vm.selectedRound = '';
			vm.roundCodes = [ 'KN-21-2015', 'KN-22-2015', 'KN-23-2015' ];

			vm.roundStatus = [
				{ key: DELIVERY_STATUS.UPCOMING_FIRST, y: 5 },
				{ key: 'Success', y: 2 },
				{ key: DELIVERY_STATUS.CANCELED_CCE, y: 9 },
				{ key: DELIVERY_STATUS.CANCELED_STAFF, y: 7 },
				{ key: DELIVERY_STATUS.CANCELED_OTHER, y: 4 },
				{ key: DELIVERY_STATUS.FAILED_CCE, y: 3 },
				{ key: DELIVERY_STATUS.FAILED_OTHER, y: 9 }
			];

			vm.margin = { left:0, top:0, bottom:0, right:0};

			var colorArray = ['grey', 'green', '#CC0000', '#FF6666', '#FF3333', '#FF6666', '#FFE6E6'];
			vm.colorFunction = function() {
				return function(d, i) {
					return colorArray[i];
				};
			};

			vm.xFunction = function(){
				return function(d) {
					return d.key;
				};
			};

			vm.yFunction = function(){
				return function(d){
					return d.y;
				};
			};


			var onTimeColors = ['green', 'orange'];
			vm.onTime = [
				{ key: 'On Time', y: 75 },
				{ key: 'Behind Time', y: 25 },
			];
			vm.onTimeColors = function() {
				return function(d, i) {
					return onTimeColors[i];
				};
			};


			vm.progressData = [
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


			var progressColorArray = ['orange', 'green', 'red', 'grey'];
			vm.progressColorFn = function() {
				return function(d, i) {
					return progressColorArray[i];
				};
			}

		});
