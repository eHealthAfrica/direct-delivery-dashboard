angular.module('planning')
		.controller('ScheduleDataImportDialogCtrl', function ($modalInstance) {

			var vm = this;

			vm.csv = {
				content: null,
				header: true,
				separator: null,
				result: null
			};

			vm.process = function () {
				//TODO: parse and process csv
			};

			vm.close = function () {
				$modalInstance.dismiss('cancel');
			};

		});