angular.module('planning')
		.controller('DeliveryAllocationCtrl', function (deliveryRound, allocationTemplates,
                                                    facilityAllocationInfo,
                                                    deliveryAllocationService, log,
                                                    calculationService) {

			var vm = this;
			vm.views = {
				packedProduct: 'Packed Product',
				productPresentation: 'Product Presentation'
			};
			vm.selectedLGA = '';
			vm.productPresentation = {};
			vm.allocationTemplates = allocationTemplates;
			vm.selectedAllocTemp = '';

			//TODO: replace with list pulled from DB after Presentation config UI has been completed.
			vm.presentations = [
				{
					"_id": "10-DPV",
					"_rev": "1-c0efb4b87d91694895ba26ba8b705ed0",
					"is_deleted": false,
					"code": "10-DPV",
					"name": "10 Doses per Vial",
					"value": 10,
					"uom": "Vial",
					"doc_type": "product_presentation",
					"description": "vaccine product presentation"
				} ,
				{
					"_id": "20-DPV",
					"_rev": "1-c0efb4b87d91694895ba26ba8b70520",
					"is_deleted": false,
					"code": "20-DPV",
					"name": "20 Doses per Vial",
					"value": 20,
					"uom": "Vial",
					"doc_type": "product_presentation",
					"description": "vaccine product presentation"
				},
				{
					"_id": "5-DPV",
					"_rev": "1-c0efb4b87d91694895ba26ba8b7055",
					"is_deleted": false,
					"code": "5-DPV",
					"name": "5 Doses per Vial",
					"value": 5,
					"uom": "Vial",
					"doc_type": "product_presentation",
					"description": "vaccine product presentation"
				},
				{
					"_id": "1-Unit",
					"_rev": "1-c0efb4b87d91694895ba26ba8b7051",
					"is_deleted": false,
					"code": "1-Unit",
					"name": "1 Unit",
					"value": 1,
					"uom": "Unit",
					"doc_type": "product_presentation",
					"description": "dry good product presentation"
				}
			];

			function initPresentations (){
				for(var ppId in vm.facAllocInfo.presentationsByProduct) {
					if(vm.facAllocInfo.presentationsByProduct.hasOwnProperty(ppId)){
            var presentation = vm.facAllocInfo.presentationsByProduct[ppId];
						if(angular.isNumber(presentation)){
							vm.productPresentation[ppId] = presentation;
						}
					}
				}
			}

			vm.deliveryRound = deliveryRound;
			vm.selectedView = vm.views.packedProduct;
			vm.facAllocInfo = facilityAllocationInfo;

			initPresentations();

			vm.isDisabled = function() {
				return vm.selectedView === vm.views.productPresentation;
			};

			vm.switchView = function (view) {
				vm.selectedView = view;
			};

			vm.hasNoAllocation = function () {
				return (vm.facAllocInfo.rows.length !== 0 &&
				vm.facAllocInfo.productList.length === 0);
			};

			vm.hasNoSchedule = function () {
				return vm.facAllocInfo.rows.length === 0;
			};

			vm.hasProducts = function () {
				return vm.facAllocInfo.productList.length > 0;
			};

			vm.updateList = function () {
				deliveryAllocationService.getAllocationBy(vm.deliveryRound._id, vm.selectedLGA)
						.then(function (result) {
							vm.facAllocInfo = result;
						})
						.catch(vm.handleError);
			};

			vm.handleError = function (err) {
				log.error('getAllocationError', err);
			};

			vm.saveRow = function ($data, facRnd) {
				deliveryAllocationService.update(facRnd._id, facRnd.facility.id, $data)
						.then(function () {
							log.success('updateFacilityPackedQty');
						})
						.catch(deliveryAllocationService.onUpdateError);
			};


			vm.updatePresentation = function($data, pCode) {
				if(vm.productPresentation[pCode] === $data[pCode]){
					var msg = 'Same value, please select different value';
					log.info('', null, msg);
					return msg;
				}
				return deliveryAllocationService.updatePackedPresentation(vm.deliveryRound._id, $data)
						.then(function (res) {
							var msg = [ pCode,
								'presentation updated to',
								$data[pCode],
								'successfully!'].join(' ');
							log.success('', res, msg);
							return true;
						})
						.catch(function(err) {
							deliveryAllocationService.onUpdateError(err);
							return false;
						});
			};

			vm.setAllocationTemplate = function (template) {
				vm.selectedAllocTemp = template;
				Object.keys(vm.selectedAllocTemp.products)
						.forEach(function (pType) {
							if(vm.facAllocInfo.productList.indexOf(pType) === -1){
								vm.facAllocInfo.productList.push(pType);
							}
						});
				calculationService.setTemplate(vm.selectedAllocTemp);
				var facilities = vm.facAllocInfo.rows
						.map(function (row) {
							return { _id: row.facility.id }
						});

        calculationService.getMonthlyRequirement(facilities)
		        .then(function (templates) {
			        vm.facAllocInfo.rows = deliveryAllocationService.updateFromTemplate(vm.facAllocInfo.rows, templates);
		        });
			};


		});