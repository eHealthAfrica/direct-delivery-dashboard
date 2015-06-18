'use strict';

angular.module('planning')
		.controller('ManageFacilitiesCtrl', function (deliveryRound, $modal) {
			var vm = this;

			vm.deliveryRound = deliveryRound;
			vm.facilityList = [];

			vm.copyFromRoundDialog = function() {
				$modal.open({
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
						}
					}
				});
			};

		});