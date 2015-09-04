angular.module('planning')
		.controller('ScheduleDataImportDialogCtrl', function ($modalInstance, dailyDeliveries, deliveryRound, scheduleService) {

			var vm = this;
			vm.headers = scheduleService.getHeaders();
			vm.roundCode = deliveryRound._id;

			vm.csv = {
				content: null,
				header: true,
				separator: ',',
				result: null
			};

			vm.getSize = function () {
				return (vm.csv.result === null) ? 0 : vm.csv.result.length;
			};

			vm.getProcessedCSVRows = function () {
				if (!angular.isArray(vm.csv.result)) {
					return {};
				}
				return scheduleService.parseCSV(vm.csv.result);
			};

			vm.isValid = function(row){
				return (vm.roundCode === row[vm.headers.roundCode.text]);
			};

			vm.applyImport = function () {
				var scheduleRowsHash = vm.getProcessedCSVRows();
				dailyDeliveries = scheduleService.applyChanges(dailyDeliveries, scheduleRowsHash);
				$modalInstance.close(dailyDeliveries);
			};

			vm.close = function () {
				$modalInstance.dismiss('cancel');
			};

		});