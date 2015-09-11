angular.module('planning')
		.controller('DeliveryAllocationCtrl', function (deliveryRound, facilityAllocationInfo, deliveryAllocationService, log) {

			var vm = this;
			vm.views = {
				packedProduct: 'Packed Product',
				productPresentation: 'Product Presentation'
			};
			vm.selectedLGA = '';
			vm.productPresentation = {};

			vm.deliveryRound = deliveryRound;
			vm.selectedView = vm.views.packedProduct;
			vm.facAllocInfo = facilityAllocationInfo;

			vm.switchView = function (view) {
				vm.selectedView = view;
			};

			vm.updateList = function() {
				deliveryAllocationService.getAllocationBy(vm.deliveryRound._id, vm.selectedLGA)
						.then(function(result) {
							vm.facAllocInfo = result;
						})
						.catch(vm.handleError);
			};

			vm.handleError = function(err){
				log.error('getAllocationError', err);
			};

			vm.saveRow = function ($data, facRnd) {
				//TODO: complete implementation
				console.log(facRnd._id, facRnd.facility.id);
				console.log('Data : ', $data, 'Facility Round : ', facRnd);
			};


		});