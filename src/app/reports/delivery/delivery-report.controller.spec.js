'use strict';

describe('DeliveryReportCtrl', function () {
	beforeEach(module('reports', 'config'));

	var DeliveryReportCtrl;

	beforeEach(inject(function ($controller, config) {
		DeliveryReportCtrl = $controller('DeliveryReportCtrl', {});
	}));

	it('should be defined', function () {
		expect(DeliveryReportCtrl).toBeDefined();
	});

	it('Should expose startFrom as date object', function () {
		var isDate = angular.isDate(DeliveryReportCtrl.startFrom);
		expect(isDate).toBeTruthy();
	});

	it('Should expose stopOn as date object', function(){
		var isDate = angular.isDate(DeliveryReportCtrl.stopOn);
		expect(isDate).toBeTruthy();
	});

	describe('DeliveryReportCtrl.start', function(){
		it('Should have "start.opened" property', function(){
			expect(DeliveryReportCtrl.start.opened).toBeDefined();
		});

		it('Should expose "start.open" as a function', function(){
			var isAFunction = angular.isFunction(DeliveryReportCtrl.start.open);
			expect(isAFunction).toBeTruthy();
		});
	});

	describe('DeliveryReportCtrl.stop', function(){
		it('Should have "stop.opened" property', function(){
			expect(DeliveryReportCtrl.stop.opened).toBeDefined();
		});

		it('Should expose "stop.open" as a function', function(){
			var isAFunction = angular.isFunction(DeliveryReportCtrl.stop.open);
			expect(isAFunction).toBeTruthy();
		});
	});

});