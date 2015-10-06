'use strict';

describe('deliveryAllocationService', function () {

	beforeEach(module('planning', 'db', 'log'));

	var dbService;
	var deliveryAllocationService;
	var log;

	beforeEach(inject(function (_dbService_, _deliveryAllocationService_, _log_) {
		dbService = _dbService_;
		deliveryAllocationService = _deliveryAllocationService_;
		log = _log_;

		spyOn(log, 'error').and.callThrough();
	}));

	it('Should be defined', function () {
		expect(deliveryAllocationService).toBeDefined();
	});

	describe('onUpdateError', function () {
		it('Should call log.error() with expected parameter if error status is 401', function() {
			var err = { status: 401 };//Authorization Error
			expect(log.error).not.toHaveBeenCalled();
			var alertMsg = 'unauthorizedAccess';
			deliveryAllocationService.onUpdateError(err);
			expect(log.error).toHaveBeenCalledWith(alertMsg, err);
		});

		it('Should call log.error() with expected parameter if error status is 409', function() {
			var err = { status: 409 };//conflict Error
			expect(log.error).not.toHaveBeenCalled();
			var alertMsg = 'updateConflict';
			deliveryAllocationService.onUpdateError(err);
			expect(log.error).toHaveBeenCalledWith(alertMsg, err);
		});

		it('Should call log.error() with expected parameter if unknown error occurred', function () {
			var err = { msg: 'Unknown Error!' };
			expect(log.error).not.toHaveBeenCalled();
			var alertMsg = 'updatePackedQtyErr';
			deliveryAllocationService.onUpdateError(err);
			expect(log.error).toHaveBeenCalledWith(alertMsg, err);
		});
	});

});
