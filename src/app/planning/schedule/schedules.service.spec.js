'use strict';

describe('ScheduleService', function () {

	beforeEach(module('planning', 'deliveryMock', 'db', 'scheduleMock', 'log'));

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
	var log;

	beforeEach(inject(function (_scheduleService_, _deliveryRoundMock_, _dailyDeliveriesMock_,
	                            _dbService_, _headerMock_, _csvExportMock_, _nestedDeliveryMock_,
	                            _flatDeliveries_, _csvResultMock_, _parsedCSVMock_,
	                            _updatedDailyDeliveryMock_, _log_) {

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
		log = _log_;

		spyOn(dbService, 'saveDocs').and.callThrough();
		spyOn(log, 'error').and.callThrough();
		spyOn(dbService, 'save').and.callThrough();

	}));

	describe('scheduleService', function () {
		it('Should be defined', function () {
			expect(scheduleService).toBeDefined();
		});
	});

	describe('saveSchedules', function () {
		it('Should call dbService.saveDocs with expected parameter', function () {
			expect(dbService.saveDocs).not.toHaveBeenCalled();
			var expectedParams = [];
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
			var result = scheduleService.applyChanges(flatDeliveries, schedulesInfo);
			var isSame = angular.equals(updatedDailyDeliveriesMock, result);
			expect(isSame).toBeTruthy();
		});
	});

	describe('onSaveError', function () {
		it('Should call log.error() with expected parameters if err.status === 401', function () {
			var err = { status: 401 };
			expect(log.error).not.toHaveBeenCalled();
			scheduleService.onSaveError(err);
			expect(log.error.calls.mostRecent().args[0]).toEqual('unauthorizedAccess');
			expect(log.error.calls.mostRecent().args[1]).toEqual(err);
		});

		it('Should call log.error() with expected parameters if err.status === 409', function () {
			var err = { status: 409 };
			expect(log.error).not.toHaveBeenCalled();
			scheduleService.onSaveError(err);
			expect(log.error.calls.mostRecent().args[0]).toEqual('updateConflict');
			expect(log.error.calls.mostRecent().args[1]).toEqual(err);
		});

		it('Should call log.error() with expected params if err.status is NOT 401 or 409', function () {
			var err = { msg: 'Unknown Error' };
			expect(log.error).not.toHaveBeenCalled();
			scheduleService.onSaveError(err);
			expect(log.error.calls.mostRecent().args[0]).toEqual('saveBatchScheduleFailed');
			expect(log.error.calls.mostRecent().args[1]).toEqual(err);
		});
	});

	describe('save', function () {
		it('should call dbService.save with expected parameter', function(){
			expect(dbService.save).not.toHaveBeenCalled();
			var doc = angular.copy(dailyDeliveries[0]);
			scheduleService.save(doc);
			expect(dbService.save).toHaveBeenCalledWith(doc);
		});
	});

	describe('preset', function () {
		it('Should return date object if param is a valid date', function(){
			var testDate = '2015-01-13';
			var result = scheduleService.presetDate(testDate);
			expect(angular.isObject(result)).toBeTruthy();
		});

		it('Should return EMPTY STRING if date is invalid', function(){
			var testDate = 'invalid-date';
			var result = scheduleService.presetDate(testDate);
			var expected = '';
			expect(result).toEqual(expected);
		});
	});

});