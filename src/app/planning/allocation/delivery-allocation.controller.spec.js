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
			facilityAllocationInfo: facilityAllocationInfo,
			deliveryAllocationService: deliveryAllocationService,
			log: log
		});

	}));

	describe('DeliveryAllocationCtrl', function () {
		it('Should be defined or instantiated', function () {
			expect(DeliveryAllocationCtrl).toBeDefined();
		});
	});

	describe('views', function () {
		it('Should have expected property "packedProduct" ', function(){
			expect(DeliveryAllocationCtrl.views.packedProduct).toBeDefined();
		});

		it('Should have expected property "productPresentation" ', function() {
			expect(DeliveryAllocationCtrl.views.productPresentation).toBeDefined();
		});
	});

	describe('views.packedProduct', function(){
		it('Should be set to expected value', function(){
			var expected = 'Packed Product';
			expect(DeliveryAllocationCtrl.views.packedProduct).toBe(expected);
		});
	});

	describe('views.productPresentation', function () {
		it('Should be set to expected value', function() {
			var expected = 'Product Presentation';
			expect(DeliveryAllocationCtrl.views.productPresentation).toBe(expected);
		});
	});

	describe('deliveryRound', function () {
		it('Should be defined', function() {
			expect(DeliveryAllocationCtrl.deliveryRound).toBeDefined();
		});

		it('Should match expected value', function(){
			expect(DeliveryAllocationCtrl.deliveryRound).toEqual(deliveryRound);
		});
	});

});