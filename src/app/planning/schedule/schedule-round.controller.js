'use strict';

angular.module('planning')
		.controller('ScheduleRoundCtrl', function (deliveryRound, dailyDeliveries) {

			var vm = this;
			vm.deliveryRound = deliveryRound;
			vm.dailyDeliveries = dailyDeliveries;

		});