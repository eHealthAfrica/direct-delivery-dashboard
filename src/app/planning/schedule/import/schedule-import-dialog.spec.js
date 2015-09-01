'use strict';

describe('ScheduleDataImportDialogCtrl', function () {

	beforeEach(module('planning', 'deliveryMock'));


	var ScheduleDataImportDialogCtrl;
	var ScheduleRoundCtrl;
	var scheduleService;
	var $modal;
	var $controller;
	var deliveryRound;
	var dailyDeliveries;
	var log;
	var csvResult;

	var $modalInstance = {
		result: {
			then: function (confirmCallback, cancelCallback) {
				//Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
				this.confirmCallBack = confirmCallback;
				this.cancelCallback = cancelCallback;
			}
		},
		close: function (item) {
			//The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
			this.result.confirmCallBack(item);
		},
		dismiss: function (type) {
			//The user clicked cancel on the modal dialog, call the stored cancel callback
			this.result.cancelCallback(type);
		}
	};

	var modalInstance;

	beforeEach(inject(function (_$controller_, _$modal_, _scheduleService_, _planningService_,
	                            _$state_, _deliveryRoundMock_, _dailyDeliveriesMock_, _log_,
	                            _csvResultMock_) {

		$controller = _$controller_;
		$modal = _$modal_;
		deliveryRound = _deliveryRoundMock_;
		dailyDeliveries = _dailyDeliveriesMock_;
		log = _log_;
		scheduleService  = _scheduleService_;
		csvResult = _csvResultMock_;

		modalInstance = {
			close: jasmine.createSpy('modalInstance.close'),
			dismiss: jasmine.createSpy('modalInstance.dismiss'),
			result: {
				then: jasmine.createSpy('modalInstance.result.then')
			}
		};

		ScheduleRoundCtrl = $controller('ScheduleRoundCtrl', {
			deliveryRound: deliveryRound,
			$state: _$state_,
			dailyDeliveries: dailyDeliveries,
			scheduleService: _scheduleService_,
			planningService: _planningService_,
			log: log
		});


		ScheduleDataImportDialogCtrl = $controller('ScheduleDataImportDialogCtrl', {
			$modalInstance: modalInstance,
			deliveryRound: deliveryRound,
			dailyDeliveries: dailyDeliveries,
			scheduleService: scheduleService
		});

		spyOn($modal, 'open').and.returnValue($modalInstance);
		spyOn($modalInstance, 'dismiss').and.callThrough();
		spyOn(scheduleService, 'parseCSV').and.callThrough();
		spyOn(ScheduleDataImportDialogCtrl, 'getProcessedCSVRows').and.callThrough();
		spyOn(scheduleService, 'applyChanges').and.callThrough();

	}));

	describe('ScheduleDataImportDialogCtrl', function () {
		it('Should be defined or instantiated', function () {
			expect(ScheduleDataImportDialogCtrl).toBeDefined();
		});
	});

	describe('roundCode', function(){
		it('Should be defined', function(){
			expect(ScheduleDataImportDialogCtrl.roundCode).toBeDefined();
		});

		it('Should equal delivery round passed dialog controller', function(){
			expect(ScheduleDataImportDialogCtrl.roundCode).toEqual(deliveryRound._id);
		});
	});

	describe('csv', function(){
		it('Should have "result" property set to null by default', function(){
			expect(ScheduleDataImportDialogCtrl.csv.result).toBeNull();
		});

		it('Should have "content" property set to null by default', function () {
			expect(ScheduleDataImportDialogCtrl.csv.content).toBeNull();
		});

		it('Should have "header" set to true by default', function () {
			expect(ScheduleDataImportDialogCtrl.csv.header).toBeTruthy();
		});

		it('Should have "separator" set to "," by default', function () {
			expect(ScheduleDataImportDialogCtrl.csv.separator).toEqual(',');
		});
	});

	describe('header', function (){
    it('Should equal expected value', function(){
	    var expected = scheduleService.getHeaders();
	    expect(ScheduleDataImportDialogCtrl.headers).toEqual(expected);
    });
	});

	describe('ScheduleDataImportDialogCtrl.close', function () {
		it('should call $modalInstance.dismiss()', function () {
			expect(modalInstance.dismiss).not.toHaveBeenCalled();
			ScheduleDataImportDialogCtrl.close();
			expect(modalInstance.dismiss).toHaveBeenCalled();
		});
	});

	describe('getProcessedCSVRows()', function(){
		it('Should NOT call scheduleService.parseCSV if csv is NOT Array', function(){
			expect(scheduleService.parseCSV).not.toHaveBeenCalled();
			ScheduleDataImportDialogCtrl.csv.result = null;
			expect(ScheduleDataImportDialogCtrl.csv.result).toBeNull();
			ScheduleDataImportDialogCtrl.getProcessedCSVRows();
			expect(scheduleService.parseCSV).not.toHaveBeenCalledWith();
		});

		it('Should call scheduleService.parseCSV if it is an array', function(){
			expect(scheduleService.parseCSV).not.toHaveBeenCalled();
			ScheduleDataImportDialogCtrl.csv.result = [];
			var isArray = angular.isArray(ScheduleDataImportDialogCtrl.csv.result);
			expect(isArray).toBeTruthy();
			ScheduleDataImportDialogCtrl.getProcessedCSVRows();
			expect(scheduleService.parseCSV).not.toHaveBeenCalledWith();
		});
	});

	describe('getSize()', function () {
		it('Should return 0 if csv.result is null', function () {
			expect(ScheduleDataImportDialogCtrl.csv.result).toBeNull();
			var result = ScheduleDataImportDialogCtrl.getSize();
			expect(result).toBe(0);
		});

		it('Should return expected size if csv.result is not empty array', function(){
			ScheduleDataImportDialogCtrl.csv.result = csvResult;
			var result = ScheduleDataImportDialogCtrl.getSize();
			expect(result).toBeGreaterThan(0);
		});
	});

	describe('isValid', function () {
		it('should return TRUE if row matches given round code', function () {
			var csvRow = csvResult[0];
			var expectedRoundCode = csvRow[ScheduleDataImportDialogCtrl.headers.roundCode.text];
			expect(ScheduleDataImportDialogCtrl.roundCode).toEqual(expectedRoundCode);
			expect(ScheduleDataImportDialogCtrl.isValid(csvRow)).toBeTruthy();
		});

		it('Should return FALSE if row and delivery round code differs', function () {
			var csvRow = csvResult[0];
			csvRow[ScheduleDataImportDialogCtrl.headers.roundCode.text] = 'KKK 245 908';
			var expectedRoundCode = csvRow[ScheduleDataImportDialogCtrl.headers.roundCode.text];
			expect(ScheduleDataImportDialogCtrl.roundCode).not.toEqual(expectedRoundCode);
			expect(ScheduleDataImportDialogCtrl.isValid(csvRow)).toBeFalsy();
		});
	});

	describe('applyImport', function () {
		it('Should call getProcessedCSVRows()', function () {
			expect(ScheduleDataImportDialogCtrl.getProcessedCSVRows).not.toHaveBeenCalled();
			ScheduleDataImportDialogCtrl.applyImport();
			expect(ScheduleDataImportDialogCtrl.getProcessedCSVRows).toHaveBeenCalled();
		});

		it('Should call scheduleService.applyChanges(param1, param2)', function () {
			expect(scheduleService.applyChanges).not.toHaveBeenCalled();
			ScheduleDataImportDialogCtrl.applyImport();
			expect(scheduleService.applyChanges).toHaveBeenCalled();
		});

		it('Should call $modalInstance.close with expected params', function () {
			expect(modalInstance.close).not.toHaveBeenCalled();
			ScheduleDataImportDialogCtrl.applyImport();
			var scheduleRowsHash = ScheduleDataImportDialogCtrl.getProcessedCSVRows();
			var expectedParam = scheduleService.applyChanges(dailyDeliveries, scheduleRowsHash);
			expect(modalInstance.close).toHaveBeenCalledWith(expectedParam);
		});

	});

});