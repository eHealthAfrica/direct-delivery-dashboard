angular.module('planning')
		.controller('ScheduleDataImportDialogCtrl', function ($modalInstance, dailyDeliveries, deliveryRound, scheduleService) {

			var vm = this;
			vm.headers = scheduleService.getHeaders();

			vm.csv = {
				content: null,
				header: true,
				separator: ',',
				result: null
			};

			vm.getSize = function () {
				return (vm.csv.result === null) ? 0 : vm.csv.result.length;
			};

			vm.getResult = function () {
				if (!angular.isArray(vm.csv.result)) {
					return {};
				}
				return scheduleService.parseCSV(vm.csv.result);
			};

			vm.applyImport = function () {
				var scheduleRowsHash = vm.getResult();
				var result = scheduleService.mergeRows(dailyDeliveries, scheduleRowsHash);
				console.log(result);
			};

			vm.close = function () {
				$modalInstance.dismiss('cancel');
			};

		});