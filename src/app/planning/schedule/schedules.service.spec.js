'use strict';

describe('ScheduleRoundController', function () {

	beforeEach(module('planning', 'deliveryMock', 'db', 'scheduleMock'));

	var scheduleService;
	var dbService;

	var deliveryRound;
	var dailyDeliveries;
	var header;

	beforeEach(inject(function (_scheduleService_, _deliveryRoundMock_, _dailyDeliveriesMock_,
	                            _dbService_, _headerMock_) {

		scheduleService = _scheduleService_;
		dbService = _dbService_;

		deliveryRound = _deliveryRoundMock_;
		dailyDeliveries = _dailyDeliveriesMock_;
		header = _headerMock_;

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

	describe('headerIndex', function(){
		it('Should have expected properties and values', function () {
			expect(scheduleService.headerIndex).toEqual(header);
		});
	});

	describe('getHeaders()', function(){
		it('Should return expected value', function(){
			expect(scheduleService.getHeaders()).toEqual(header);
		});
	});

});