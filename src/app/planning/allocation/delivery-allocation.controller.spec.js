'use strict';

describe('DeliveryAllocationCtrl', function () {

	beforeEach(module('planning', 'deliveryMock', 'utility', 'log', 'deliveryAllocationMock'));

	var log;
	var $controller;
	var deliveryRound;
	var facilityAllocationInfo;
	var deliveryAllocationService;
	var DeliveryAllocationCtrl;

	beforeEach(inject(function (_$controller_, _log_, _deliveryAllocationService_, _deliveryRoundMock_, _facilityAllocationInfoMock_) {
		$controller = _$controller_;
		log = _log_;
		deliveryRound = _deliveryRoundMock_;
		facilityAllocationInfo = _facilityAllocationInfoMock_;
		deliveryAllocationService = _deliveryAllocationService_;


		DeliveryAllocationCtrl = $controller('DeliveryAllocationCtrl', {
			deliveryRound: deliveryRound,
			facilityAllocationInfo: angular.copy(facilityAllocationInfo),//avoid shallow copying
			deliveryAllocationService: deliveryAllocationService,
			log: log
		});

		spyOn(deliveryAllocationService, 'getAllocationBy').and.callThrough();
		spyOn(deliveryAllocationService, 'update').and.callThrough();
		spyOn(log, 'error').and.callThrough();

	}));

	describe('DeliveryAllocationCtrl', function () {
		it('Should be defined or instantiated', function () {
			expect(DeliveryAllocationCtrl).toBeDefined();
		});
	});

	describe('views', function () {
		it('Should have expected property "packedProduct" ', function () {
			expect(DeliveryAllocationCtrl.views.packedProduct).toBeDefined();
		});

		it('Should have expected property "productPresentation" ', function () {
			expect(DeliveryAllocationCtrl.views.productPresentation).toBeDefined();
		});
	});

	describe('views.packedProduct', function () {
		it('Should be set to expected value', function () {
			var expected = 'Packed Product';
			expect(DeliveryAllocationCtrl.views.packedProduct).toBe(expected);
		});
	});

	describe('views.productPresentation', function () {
		it('Should be set to expected value', function () {
			var expected = 'Product Presentation';
			expect(DeliveryAllocationCtrl.views.productPresentation).toBe(expected);
		});
	});

	describe('deliveryRound', function () {
		it('Should be defined', function () {
			expect(DeliveryAllocationCtrl.deliveryRound).toBeDefined();
		});

		it('Should match expected value', function () {
			expect(DeliveryAllocationCtrl.deliveryRound).toEqual(deliveryRound);
		});
	});

	describe('switchView', function () {
		it('Should set DeliveryAllocationCtrl.selectedView to parameter called with', function () {
			var testView = 'test-view';
			expect(DeliveryAllocationCtrl.selectedView).not.toBe(testView);
			DeliveryAllocationCtrl.switchView(testView);
			expect(DeliveryAllocationCtrl.selectedView).toBe(testView);
		});
	});

	describe('updateList', function () {
		it('Should deliveryAllocationService.getAllocationBy() with expected parameters', function () {
			expect(deliveryAllocationService.getAllocationBy).not.toHaveBeenCalled();
			DeliveryAllocationCtrl.updateList();
			var param1 = DeliveryAllocationCtrl.deliveryRound._id;
			var param2 = DeliveryAllocationCtrl.selectedLGA;
			expect(deliveryAllocationService.getAllocationBy).toHaveBeenCalledWith(param1, param2);
		});
	});

	describe('handleError', function () {
		it('Should call log.error() with expected parameter', function () {
			expect(log.error).not.toHaveBeenCalled();
			var err = 'Error message';
			DeliveryAllocationCtrl.handleError(err);
			var expectedAlertMsg = 'getAllocationError';
			expect(log.error).toHaveBeenCalledWith(expectedAlertMsg, err);
		});
	});

	describe('saveRow', function () {
		it('Should deliveryAllocationService.update() with expected parameter', function () {
			expect(deliveryAllocationService.update).not.toHaveBeenCalled();
			var facRnd = DeliveryAllocationCtrl.facAllocInfo.rows[0];
			var expectedId  = facRnd._id;
			var expectedFacilityId = facRnd.facility.id;
      var $data = {};
			DeliveryAllocationCtrl.saveRow($data, facRnd);
			expect(deliveryAllocationService.update).toHaveBeenCalledWith(expectedId, expectedFacilityId, $data);
		});
	});

	describe('hasNoAllocation', function () {
		it('Should return TRUE if facility list is not Empty and product list is Empty Object', function() {
			DeliveryAllocationCtrl.facAllocInfo.productList = [];
			expect(DeliveryAllocationCtrl.facAllocInfo.rows.length).toBeGreaterThan(0);
			expect(DeliveryAllocationCtrl.facAllocInfo.productList.length).toBe(0);
			expect(DeliveryAllocationCtrl.hasNoAllocation()).toBeTruthy();
		});

		it('Should return FALSE if facility list is EMPTY and product list is NOT EMPTY Object', function () {
			DeliveryAllocationCtrl.facAllocInfo.rows = [];
			expect(DeliveryAllocationCtrl.facAllocInfo.rows.length).toBe(0);
			expect(DeliveryAllocationCtrl.facAllocInfo.productList.length).toBeGreaterThan(0);
			expect(DeliveryAllocationCtrl.hasNoAllocation()).toBeFalsy();
		});

		it('Should return FALSE if both facility and product list are EMPTY', function () {
			DeliveryAllocationCtrl.facAllocInfo.productList = [];
			DeliveryAllocationCtrl.facAllocInfo.rows = [];
			expect(DeliveryAllocationCtrl.facAllocInfo.rows.length).toBe(0);
			expect(DeliveryAllocationCtrl.facAllocInfo.productList.length).toBe(0);
			expect(DeliveryAllocationCtrl.hasNoAllocation()).toBeFalsy();
		});
	});

	describe('hasNoSchedule', function () {
		it('Should return TRUE only if, facility list is EMPTY', function() {
			DeliveryAllocationCtrl.facAllocInfo.rows = [];
			expect(DeliveryAllocationCtrl.facAllocInfo.rows.length).toBe(0);
			expect(DeliveryAllocationCtrl.hasNoSchedule()).toBeTruthy();
		});
	});

	describe('hasProducts', function() {
		it('Should return TRUE if product list is NOT EMPTY', function () {
			expect(DeliveryAllocationCtrl.facAllocInfo.productList.length).toBeGreaterThan(0);
			expect(DeliveryAllocationCtrl.hasProducts()).toBeTruthy();
		});

		it('Should return FALSE if product list is EMPTY', function () {
			DeliveryAllocationCtrl.facAllocInfo.productList = [];
			expect(DeliveryAllocationCtrl.facAllocInfo.productList.length).toBe(0);
			expect(DeliveryAllocationCtrl.hasProducts()).toBeFalsy();
		});

	});

});