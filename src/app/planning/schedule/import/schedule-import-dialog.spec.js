'use strict';

describe('ScheduleDataImportDialogCtrl', function () {

	beforeEach(module('planning', 'deliveryMock'));


	var ScheduleDataImportDialogCtrl;
	var ScheduleRoundCtrl;
	var $modal;
	var $controller;
	var deliveryRound;
	var dailyDeliveries;
	var log;

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

	beforeEach(inject(function (_$controller_, _$modal_, _scheduleService_, _planningService_, _$state_, _deliveryRoundMock_, _dailyDeliveriesMock_, _log_) {
		$controller = _$controller_;
		$modal = _$modal_;
		deliveryRound = _deliveryRoundMock_;
		dailyDeliveries = _dailyDeliveriesMock_;
		log = _log_;

		modalInstance = {                    // Create a mock object using spies
			close: jasmine.createSpy('modalInstance.close'),
			dismiss: jasmine.createSpy('modalInstance.dismiss'),
			result: {
				then: jasmine.createSpy('modalInstance.result.then')
			}
		};

		spyOn($modal, 'open').and.returnValue($modalInstance);
		spyOn($modalInstance, 'dismiss').and.callThrough();

		ScheduleRoundCtrl = $controller('ScheduleRoundCtrl', {
			deliveryRound: deliveryRound,
			$state: _$state_,
			dailyDeliveries: dailyDeliveries,
			scheduleService: _scheduleService_,
			planningService: _planningService_,
			log: log
		});



		ScheduleDataImportDialogCtrl = $controller('ScheduleDataImportDialogCtrl', {
			$modalInstance: modalInstance
		});

	}));

	describe('ScheduleDataImportDialogCtrl', function () {
		it('Should be defined or instantiated', function () {
			expect(ScheduleDataImportDialogCtrl).toBeDefined();
		});
	});

	describe('ScheduleDataImportDialogCtrl.close', function () {
		it('should call $modalInstance.dismiss()', function() {
			expect(modalInstance.dismiss).not.toHaveBeenCalled();
			ScheduleDataImportDialogCtrl.close();
			expect(modalInstance.dismiss).toHaveBeenCalled();
		});
	});

});