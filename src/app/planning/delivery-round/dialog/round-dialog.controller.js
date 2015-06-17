angular.module('planning')
		.controller('RoundDialogCtrl', function ($scope, log, $modalInstance, config, deliveryRound,
                                             $state, planningService) {

			var vm = this;//view model
      vm.edit = false;

      if(!angular.isObject(deliveryRound)){
	      vm.deliveryRound = {
		      state: '',
		      roundNo: '',
		      startDate: new Date(),
		      endDate: ''
	      };
      }else{
	      vm.deliveryRound = deliveryRound;
	      vm.edit = true;
      }

			//TODO: load this from DB when location and facility has been pulled in.
			vm.states = [
				{ name: "Kano", code: 'KN' },
				{ name: "Bauchi", code: 'BA'}
			];

			function openDatePicker($event) {
				$event.preventDefault();
				$event.stopPropagation();
				this.opened = true;
			}

			$scope.dateFormat = config.dateFormat;
			$scope.start = {
				opened: false,
				open: openDatePicker
			};

			vm.setRoundNumber = function(){
				if(angular.isString(vm.deliveryRound._id) && !vm.deliveryRound.roundNo){
					var strList = vm.deliveryRound._id.split('-');
					var roundNoIndex = 1;
					vm.deliveryRound.roundNo = strList[roundNoIndex];
				}
			};

			vm.setRoundNumber();

			vm.getRoundCode = function(){
				return planningService.getRoundCode(vm.deliveryRound);
			};

			$scope.end = {
				opened: false,
				open: openDatePicker
			};

			function onSuccessContinue(res){
				log.success('savedDeliveryRound');
				return $modalInstance.close(res);
				//TODO: $state.go('schedulePage');
			}

			function onSuccessExit(res){
				log.success('savedDeliveryRound');
				$state.go('planning.deliveryRound', $state.params, { reload: true })
						.finally(function(){
							$modalInstance.close(res);
						});
			}

			function createAndContinue(){
				planningService.createRound(vm.deliveryRound)
						.then(onSuccessContinue)
						.catch(planningService.onSaveError);
			}

			function saveEditAndContinue(){
				planningService.saveRound(vm.deliveryRound)
						.then(onSuccessContinue)
						.catch(planningService.onSaveError);
			}

			function createAndExit(){
				planningService.createRound(vm.deliveryRound)
						.then(onSuccessExit)
						.catch(planningService.onSaveError);
			}

			function saveEditAndExit(){
				planningService.saveRound(vm.deliveryRound)
						.then(onSuccessExit)
						.catch(planningService.onSaveError);
			}

			vm.continue = function(){
				if(vm.edit){
					saveEditAndContinue();
				}else{
					createAndContinue();
				}
			};

			vm.saveAndExit = function(){
				if(vm.edit){
					saveEditAndExit();
				}else{
					createAndExit();
				}
			};

			vm.cancel = function () {
				$modalInstance.dismiss('cancel');
			};

		});