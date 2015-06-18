angular.module('planning')
		.controller('CopyRoundTemplateDialogCtrl', function($modalInstance, deliveryRounds) {
			var vm = this;

			vm.selectedRoundId = '';
			vm.deliveryRounds = deliveryRounds;

			vm.cancel = function () {
				$modalInstance.dismiss('cancel');
			};

		});