'use strict';

describe('ScheduleRoundController', function () {

	beforeEach(module('planning', 'deliveryMock', 'db', 'scheduleMock'));

	var scheduleService;
	var dbService;

	var deliveryRound;
	var dailyDeliveries;
	var header;
	var csvExport;
	var nestedDeliveries;
	var flatDeliveries;
	var csvResult;
	var parsedCSV;
	var updatedDailyDeliveriesMock;

	beforeEach(inject(function (_scheduleService_, _deliveryRoundMock_, _dailyDeliveriesMock_,
	                            _dbService_, _headerMock_, _csvExportMock_, _nestedDeliveryMock_,
	                            _flatDeliveries_, _csvResultMock_, _parsedCSVMock_,
	                            _updatedDailyDeliveryMock_) {

		scheduleService = _scheduleService_;
		dbService = _dbService_;

		deliveryRound = _deliveryRoundMock_;
		dailyDeliveries = _dailyDeliveriesMock_;
		header = _headerMock_;
		csvExport = _csvExportMock_;
		nestedDeliveries = _nestedDeliveryMock_;
		flatDeliveries = _flatDeliveries_;
		csvResult = _csvResultMock_;
		parsedCSV = _parsedCSVMock_;
		updatedDailyDeliveriesMock = _updatedDailyDeliveryMock_;

		spyOn(dbService, 'saveDocs').and.callThrough();

	}));

	describe('scheduleService', function () {
		it('Should be defined', function () {
			expect(scheduleService).toBeDefined();
		});
	});

	describe('saveSchedules', function () {
		it('Should call dbService.saveDocs with expected parameter', function () {
			expect(dbService.saveDocs).not.toHaveBeenCalled();
			var expectedParams = {};
			scheduleService.saveSchedules(expectedParams);
			expect(dbService.saveDocs).toHaveBeenCalledWith(expectedParams);
		});
	});

	describe('headerIndex', function () {
		it('Should have expected properties and values', function () {
			expect(scheduleService.headerIndex).toEqual(header);
		});
	});

	describe('getHeaders()', function () {
		it('Should return expected value', function () {
			expect(scheduleService.getHeaders()).toEqual(header);
		});
	});

	describe('prepareForExport', function () {
		it('Should export expected csv header ', function () {
			var exportData = scheduleService.prepareExport(deliveryRound._id, dailyDeliveries);
			expect(exportData.headers).toEqual(csvExport.headers);
		});

		it('Should return expected csv rows', function () {
			var exportData = scheduleService.prepareExport(deliveryRound._id, dailyDeliveries);
			var isSame = angular.equals(exportData.rows, csvExport.rows);
			expect(isSame).toBeTruthy();
		});
	});

	describe('flatten', function () {
		it('Should return expected result i.e flatten deliveries', function () {
			var result = scheduleService.flatten(nestedDeliveries);
			var isSame = angular.equals(result, flatDeliveries);
			expect(isSame).toBeTruthy();
		});
	});

	describe('parseCSV', function () {
		it('Should parse CSV import into expected rows with expected properties', function () {
			var result = scheduleService.parseCSV(csvResult);
			var isSame = angular.equals(parsedCSV, result);
			expect(isSame).toBeTruthy();
		});
	});

	describe('applyChanges', function () {
		it('Should apply csv update to daily deliveries', function () {
			var schedulesInfo = scheduleService.parseCSV(csvResult);
			var flatDeliveries = scheduleService.flatten(nestedDeliveries);
			var result  = scheduleService.applyChanges(flatDeliveries, schedulesInfo);
			var isSame = angular.equals(updatedDailyDeliveriesMock, result);
			expect(isSame).toBeTruthy();
		});
	});

});