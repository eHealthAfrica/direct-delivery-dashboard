'use strict';

describe('ScheduleRoundController', function () {

	beforeEach(module('planning', 'deliveryMock'));

	var $controller;
	var $state;
	var dailyDeliveries;
	var scheduleService;
	var planningService;
	var log;
	var ScheduleRoundCtrl;
	var deliveryRound;
	var $modal;


	beforeEach(inject(function (_$controller_, _$state_, _scheduleService_, _planningService_, _log_, _deliveryRoundMock_, _dailyDeliveriesMock_, _$modal_) {
		$controller = _$controller_;
		$state = _$state_;
		scheduleService = _scheduleService_;
		planningService = _planningService_;
		log = _log_;
		deliveryRound = _deliveryRoundMock_;
		$modal = _$modal_;
		dailyDeliveries = _dailyDeliveriesMock_;

		ScheduleRoundCtrl = $controller('ScheduleRoundCtrl', {
			deliveryRound: deliveryRound,
			$state: $state,
			dailyDeliveries: dailyDeliveries,
			scheduleService: scheduleService,
			planningService: planningService,
			log: log,
			$modal: $modal
		});

		spyOn(planningService, 'completePlanning').and.callThrough();
		spyOn($modal, 'open').and.callThrough();

	}));

	describe('ScheduleRoundCtrl', function () {
		it('Should be defined or instantiated', function () {
			expect(ScheduleRoundCtrl).toBeDefined();
		});
	});

	describe('ScheduleRoundCtrl.deliveryRound', function () {
		it('Should be defined', function () {
			expect(ScheduleRoundCtrl.deliveryRound).toBeDefined();
		});

		it('Should equal injected object', function () {
			expect(ScheduleRoundCtrl.deliveryRound).toEqual(deliveryRound);
		});

		it('Should have _id property', function () {
			expect(ScheduleRoundCtrl.deliveryRound._id).toBeDefined();
		});
	});

	describe('ScheduleRoundCtrl.dailyDeliveries', function () {
		it('Should be defined', function () {
			expect(ScheduleRoundCtrl.dailyDeliveries).toBeDefined();
		});

		it('Should equal result of scheduleService.flatten', function () {
			var expected = scheduleService.flatten(dailyDeliveries);
			expect(ScheduleRoundCtrl.dailyDeliveries).toEqual(expected);
		});
	});


	describe('ScheduleRoundCtrl.exportForRouting', function () {
		it('Should be defined', function () {
			expect(ScheduleRoundCtrl.exportForRouting).toBeDefined();
		});

		it('Should set ScheduleRoundCtrl.exportForRouting to expected array', function () {
			var exportData = scheduleService.prepareExport(deliveryRound._id, dailyDeliveries);
			expect(ScheduleRoundCtrl.exportForRouting).toEqual(exportData.rows);
		});
	});

	describe('ScheduleRoundCtrl.exportHeader', function () {
		it('Should match expected array in given order', function () {
			var exportData = scheduleService.prepareExport(deliveryRound._id, dailyDeliveries);
			expect(ScheduleRoundCtrl.exportHeader).toEqual(exportData.headers);
		});
	});

	describe('ScheduleRoundCtrl.completePlanning', function () {
		it('Should call planningService.completePlanning with expected parameter', function () {
			expect(planningService.completePlanning).not.toHaveBeenCalled();
			ScheduleRoundCtrl.completePlanning(deliveryRound);
			expect(planningService.completePlanning).toHaveBeenCalledWith(deliveryRound);
		});
	});

	describe('ScheduleRoundCtrl.openImportDialog', function () {
		it('Should call $modal.open()', function () {
			expect($modal.open).not.toHaveBeenCalled();
			ScheduleRoundCtrl.openImportDialog();
			expect($modal.open).toHaveBeenCalled();
		});

		it('Should call $modal.open() with expected parameters', function () {
			expect($modal.open).not.toHaveBeenCalled();
			ScheduleRoundCtrl.openImportDialog();
			expect($modal.open).toHaveBeenCalled();
		});
	});

	describe('isUpdated', function () {
		it('should return True if both are not the same', function () {
			var row = {
				"_id": "d3a16874da59f7b40cab3eadd41ac085",
				"deliveryRoundID": "KN-21-2015",
				"facility": {
					"zone": "Bichi",
					"lga": "Gwarzo",
					"ward": "Kutama",
					"name": "Test Fac 1",
					"id": "KNS THF - JIK",
					"contact": "Test Driver Name",
					"phoneNo": "0801234567"
				},
				"date": "2015-04-27",
				"driverID": "bashir@example.com",
				"drop": 1,
				"window": "9AM-11AM",
				"status": "Success: 1st attempt"
			};
			expect(ScheduleRoundCtrl.isUpdated(row)).toBeFalsy();
			row.drop = 5;//change row
			expect(ScheduleRoundCtrl.isUpdated(row)).toBeTruthy();
		});
	});

});