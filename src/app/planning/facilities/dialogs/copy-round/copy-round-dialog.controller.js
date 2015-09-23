'use strict';

angular.module('planning')
		.controller('CopyRoundTemplateDialogCtrl', function($modalInstance, deliveryService, deliveryRound,
                                                        deliveryRounds, log, copyRoundService) {
			var vm = this;

			vm.selectedRoundId = '';
			vm.deliveryRounds = deliveryRounds;
			vm.isLoading = false;
			vm.currentRound = deliveryRound;

			vm.cancel = function () {
				$modalInstance.dismiss('cancel');
			};

			function onSuccess(dailySchedules){
				var roundTemplate = copyRoundService.prepareFromTemplate(vm.currentRound._id, dailySchedules);
				$modalInstance.close(roundTemplate);
				vm.isLoading = true;
			}

			function onError(err){
				log.error('deliveryRoundDoesNotHaveDailySchedule', err);
				vm.isLoading = false;
			}

			vm.copy = function(){
				vm.isLoading = true;
				deliveryService.getByRoundId(vm.selectedRoundId)
						.then(onSuccess)
						.catch(onError);
			};

		});