'use strict';

angular.module('planning')
		.controller('ScheduleRoundCtrl', function (deliveryRound, drivers, dailyDeliveries, scheduleService) {

			var vm = this;
			vm.deliveryRound = deliveryRound;
			vm.dailyDeliveries = scheduleService.flatten(dailyDeliveries);
      vm.drivers = drivers;


		});