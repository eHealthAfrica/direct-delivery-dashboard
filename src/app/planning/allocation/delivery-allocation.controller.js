angular.module('planning')
		.controller('DeliveryAllocationCtrl', function (deliveryRound, facilityAllocationInfo) {

			var vm = this;
			vm.views = {
				packedProduct: 'Packed Product',
				productPresentation: 'Product Presentation'
			};
			vm.productPresentation = {};

			vm.deliveryRound = deliveryRound;
			vm.selectedView = vm.views.packedProduct;
			vm.facilityRounds = facilityAllocationInfo.rows;
			vm.productList = facilityAllocationInfo.productList;


			vm.switchView = function (view) {
				vm.selectedView = view;
			};

			vm.saveRow = function ($data, $index) {

			};


		});