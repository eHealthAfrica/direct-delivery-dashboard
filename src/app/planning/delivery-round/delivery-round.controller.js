angular.module('planning')
		.controller('DeliveryRoundCtrl', function ($modal, deliveryRounds) {

      var vm = this;
			vm.deliveryRounds = deliveryRounds;


			vm.open = function () {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'app/planning/delivery-round/dialog/round.html',
					controller: 'RoundDialogCtrl',
					controllerAs: 'nrdCtrl',
					size: 'lg',
					keyboard: false,
					backdrop: 'static',
					resolve: {
						//TODO: load delivery round here and pass to dialog for edit of existing DR.
					}
				});

				modalInstance.result
						.then(function(res) {
							console.log(res);
						})
						.catch(function(err) {
							console.log(err);
						});
			};

		});