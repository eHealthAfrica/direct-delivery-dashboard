'use strict';

describe('returnRouteService', function () {

	beforeEach(module('planning', 'db', 'log'));

	var dbService;
	var returnRouteService;
	var log;

	beforeEach(inject(function (_dbService_, _returnRouteService_, _log_) {
		dbService = _dbService_;
		returnRouteService = _returnRouteService_;
		log = _log_;

		spyOn(log, 'error').and.callThrough();
		spyOn(dbService, 'update').and.callThrough();
		spyOn(dbService, 'insert').and.callThrough();
		spyOn(dbService, 'getView').and.callThrough();

	}));

	it('Should be defined', function () {
		expect(returnRouteService).toBeDefined();
	});

	describe('onSaveError', function () {
		it('Should call log.error() with expected parameter if error status is 401', function () {
			var err = { status: 401 };//Authorization Error
			expect(log.error).not.toHaveBeenCalled();
			var alertMsg = 'unauthorizedAccess';
			returnRouteService.onSaveError(err);
			expect(log.error).toHaveBeenCalledWith(alertMsg, err);
		});

		it('Should call log.error() with expected parameter if error status is 409', function() {
			var err = { status: 409 };//conflict Error
			expect(log.error).not.toHaveBeenCalled();
			var alertMsg = 'updateConflict';
			returnRouteService.onSaveError(err);
			expect(log.error).toHaveBeenCalledWith(alertMsg, err);
		});

		it('Should call log.error() with expected parameter if unknown error occurred', function () {
			var err = { msg: 'Unknown Error!' };
			expect(log.error).not.toHaveBeenCalled();
			var alertMsg = 'saveReturnRouteErr';
			returnRouteService.onSaveError(err);
			expect(log.error).toHaveBeenCalledWith(alertMsg, err);
		});
	});

	describe('save', function () {
		it('Should call dbService.update() if doc._id exists', function () {
			var doc = { _id: 'test-id', doc_type: 'return-route' };
			expect(dbService.update).not.toHaveBeenCalled();
			returnRouteService.save(doc);
			expect(dbService.update).toHaveBeenCalled();
		});

		it('Should call dbService.insert() if doc._id does NOT exits', function () {
			var doc = { doc_type: 'return-route' };
			expect(dbService.insert).not.toHaveBeenCalled();
			returnRouteService.save(doc);
			expect(dbService.insert).toHaveBeenCalled();
		});

		it('Should add set doc_type to "return-route" ', function(){
			var doc = {  };
			expect(dbService.insert).not.toHaveBeenCalled();
			returnRouteService.save(doc);
			var arg = dbService.insert.calls.mostRecent().args[0];
			expect(arg.doc_type).toBe('return-route');
		});
	});

	describe('getBy', function () {
		it('Should call dbService.getView() twice', function () {
			expect(dbService.getView).not.toHaveBeenCalled();
			var roundId = 'KN-21-2015';
			returnRouteService.getBy(roundId);
			var expected = 2;
			var callCount = dbService.getView.calls.count();
			expect(callCount).toEqual(expected);
		});

	});

});
