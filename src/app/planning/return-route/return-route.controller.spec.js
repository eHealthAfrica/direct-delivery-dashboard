'use strict';

describe('ReturnRouteCtrl', function () {

	beforeEach(module('planning', 'deliveryMock', 'utility', 'log', 'returnRouteMock'));

	var log;
	var utility;
	var $controller;
	var deliveryRound;
	var packingStores;
	var ReturnRouteCtrl;
	var returnRouteService;
	var deliveryReturnRoutes;

	beforeEach(inject(function (_$controller_, _log_, _deliveryAllocationService_, _packingStoresMock_, $q,
	                            _deliveryRoundMock_, _utility_, _returnRouteService_, _deliveryReturnRoutesMock_) {

		log = _log_;
		utility = _utility_;
		$controller = _$controller_;
		packingStores = _packingStoresMock_;
		deliveryRound = _deliveryRoundMock_;
		returnRouteService = _returnRouteService_;
		deliveryReturnRoutes = _deliveryReturnRoutesMock_;


		ReturnRouteCtrl = $controller('ReturnRouteCtrl', {
			deliveryRound: deliveryRound,
			packingStores: angular.copy(packingStores),//avoid shallow copying
			deliveryReturnRoutes: angular.copy(deliveryReturnRoutes),
			utility: utility,
			log: log,
			returnRouteService: returnRouteService
		});

		spyOn(ReturnRouteCtrl, 'getDocBy').and.callThrough();
    spyOn(returnRouteService, 'save').and.callFake(function(doc){
	    return $q.when(doc);
    });
	}));

	describe('ReturnRouteCtrl', function () {
		it('Should be defined or instantiated', function () {
			expect(ReturnRouteCtrl).toBeDefined();
		});

		it('Should expose ReturnRouteCtrl.query', function () {
			expect(ReturnRouteCtrl.query).toBeDefined();
		});

		it('Should expose ReturnRouteCtrl.query', function () {
			var expected = '';
			expect(ReturnRouteCtrl.query).toBe(expected);
		});

		it('Should have set delivery round to expected object',  function() {
			expect(ReturnRouteCtrl.deliveryRound).toEqual(deliveryRound);
		});

		it('Should set packing stores to expected array', function() {
			expect(ReturnRouteCtrl.packingStores).toEqual(packingStores);
		});

		it('Should set delivery return routes to expected array', function() {
			expect(ReturnRouteCtrl.deliveryReturnRoutes).toEqual(deliveryReturnRoutes);
		});

	});

	describe('getDocBy', function () {
    it('Should return expected result', function () {
	    var driverId = 'abdullahi@example.com';
	    var deliveryDate ="2015-05-08";
	    var expected = ReturnRouteCtrl.deliveryReturnRoutes[1];//second element
	    var result = ReturnRouteCtrl.getDocBy(driverId, deliveryDate);
	    expect(result).toEqual(expected);
    });

		it('Should return empty undefined', function () {
			it('Should return expected result', function () {
				var driverId = 'unknown@example.com';
				var deliveryDate ="2015-05-08";
				var result = ReturnRouteCtrl.getDocBy(driverId, deliveryDate);
				expect(result).not.toBeDefined();
			});
		});
	});

	describe('saveRow', function () {
		it('Should call getDocBy() with expected parameters', function () {
			expect(ReturnRouteCtrl.getDocBy).not.toHaveBeenCalled();
			var driverId = 'abdullahi@example.com';
			var deliveryDate ="2015-05-08";
			var $data = {};
			ReturnRouteCtrl.saveRow($data, driverId, deliveryDate);
			expect(ReturnRouteCtrl.getDocBy).toHaveBeenCalledWith(driverId, deliveryDate);
		});

		it('Should call returnRouteService.save() with updated doc', function() {
			var $data = {
				estimatedDistance: 172,
				actualDistance: 173,
				store: {
					_id: 'NASSARAWA-ZONAL-STORE',
					name: 'Nassarawa Zonal Store',
					state: 'Kano'
				}
			};
			var driverId = 'abdullahi@example.com';
			var deliveryDate ="2015-05-08";
			var expected = ReturnRouteCtrl.getDocBy(driverId, deliveryDate);
			expected.estimatedDistance = $data.estimatedDistance;
			expected.actualDistance = $data.actualDistance;
			expected.store = $data.store;
      expect(returnRouteService.save).not.toHaveBeenCalled();
			ReturnRouteCtrl.saveRow($data, driverId, deliveryDate);
			expect(returnRouteService.save).toHaveBeenCalledWith(expected);
		});
	});

});