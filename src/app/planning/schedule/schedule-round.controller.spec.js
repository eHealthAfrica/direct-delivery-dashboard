'use strict';

describe('ScheduleRoundController', function () {

	beforeEach(module('planning', 'deliveryMock', 'utility'));

	var $controller;
	var $state;
	var dailyDeliveries;
	var scheduleService;
	var planningService;
	var log;
	var ScheduleRoundCtrl;
	var deliveryRound;
	var $modal;
	var utility;
	var row;


	beforeEach(inject(function (_$controller_, _$state_, _scheduleService_,
	                            _planningService_, _log_, _deliveryRoundMock_,
	                            _dailyDeliveriesMock_, _$modal_, _utility_) {

		$controller = _$controller_;
		$state = _$state_;
		scheduleService = _scheduleService_;
		planningService = _planningService_;
		log = _log_;
		deliveryRound = _deliveryRoundMock_;
		$modal = _$modal_;
		dailyDeliveries = _dailyDeliveriesMock_;
		utility = _utility_;


		ScheduleRoundCtrl = $controller('ScheduleRoundCtrl', {
			deliveryRound: deliveryRound,
			$state: $state,
			dailyDeliveries: dailyDeliveries,
			scheduleService: scheduleService,
			planningService: planningService,
			log: log,
			$modal: $modal,
			utility: utility
		});

		row = {
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
			"date": new Date("2015-04-27"),
			"driverID": "bashir@example.com",
			"drop": 1,
			"window": "9AM-11AM",
			"status": "Success: 1st attempt"
		};

		spyOn(planningService, 'completePlanning').and.callThrough();
		spyOn($modal, 'open').and.callThrough();
		spyOn(scheduleService, 'hashRow').and.callThrough();
		spyOn(scheduleService, 'applyChanges').and.callThrough();

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
			expect(ScheduleRoundCtrl.isUpdated(row)).toBeFalsy();
			row.drop = 5;//change row
			expect(ScheduleRoundCtrl.isUpdated(row)).toBeTruthy();
		});
	});

	describe('saveRow', function(){
		it('Should call scheduleService.hashRow() with expected parameters', function () {
			expect(scheduleService.hashRow).not.toHaveBeenCalled();
			var $data = {};
			var facRnd = dailyDeliveries[1];
			ScheduleRoundCtrl.saveRow($data, facRnd);
			expect(scheduleService.hashRow.calls.mostRecent().args[0]).toEqual(deliveryRound._id);
			expect(scheduleService.hashRow.calls.mostRecent().args[1]).toEqual(facRnd.facility.id);
			expect(scheduleService.hashRow.calls.mostRecent().args[2]).toEqual(facRnd._id);
		});

		it('Should call scheduleService.applyChanges()', function(){
			expect(scheduleService.applyChanges).not.toHaveBeenCalled();
			var data = {};
			ScheduleRoundCtrl.saveRow(data, row);
			expect(scheduleService.applyChanges).toHaveBeenCalled();
		});
	});

});