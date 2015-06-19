'use strict';

angular.module('planning')
		.controller('ManageFacilitiesCtrl', function (deliveryRound, $modal) {
			var vm = this;

			vm.deliveryRound = deliveryRound;
			vm.facilityList = [];
			vm.selectedList = [];

			vm.isSelected = function(facilityId){
				var NOT_FOUND = -1;
				return vm.selectedList.indexOf(facilityId) !== NOT_FOUND;
			};

			vm.onSelection = function(roundTemplate){
				vm.facilityList = [];
				roundTemplate.forEach(function(dailySchedule){
					dailySchedule.facilityRounds.forEach(function(facilityRound){
						vm.facilityList.push(facilityRound.facility);
						vm.selectedList.push(facilityRound.facility.id);
					});
				});
			};

			vm.copyFromRoundDialog = function() {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'app/planning/facilities/dialogs/copy-round/copy-round.html',
					controller: 'CopyRoundTemplateDialogCtrl',
					controllerAs: 'crtdCtrl',
					size: 'lg',
					keyboard: false,
					backdrop: 'static',
					resolve: {
						deliveryRounds: function(planningService){
							return planningService.all()
									.catch(function(){
										return [];
									});
						},
						deliveryRound: function(){
							return vm.deliveryRound;
						}
					}
				});

				modalInstance.result
						.then(vm.onSelection);
			};

		});