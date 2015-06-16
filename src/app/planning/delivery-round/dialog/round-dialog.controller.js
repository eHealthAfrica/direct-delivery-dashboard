angular.module('planning')
		.controller('RoundDialogCtrl', function ($scope, $modalInstance, config) {

			var vm = this;//view model

			vm.deliveryRound = {
				state: '',
				roundNo: '',
				startDate: new Date(),
				endDate: ''
			};

			//TODO: load this from DB when location and facility has been pulled in.
			vm.states = [
				{ name: "Kano", code: 'KN' },
				{ name: "Bauchi", code: 'BA'}
			];


			$scope.dateFormat = config.dateFormat;
			$scope.start = {
				opened: false,
				open: function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					this.opened = true;
				}
			};

			vm.getRoundCode = function(){
				var startYear = new Date(vm.deliveryRound.startDate).getFullYear();
				return [
					vm.deliveryRound.state,
					vm.deliveryRound.roundNo,
					startYear
				].join('-');
			};

			$scope.end = {
				opened: false,
				open: function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					this.opened = true;
				}
			};

			$scope.continue = function () {
				$modalInstance.close($scope.selected.item);
			};

			vm.cancel = function () {
				$modalInstance.dismiss('cancel');
			};

		});