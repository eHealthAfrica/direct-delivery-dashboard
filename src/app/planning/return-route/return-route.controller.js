'use strict';

angular.module('planning')
		.controller('ReturnRouteCtrl', function (deliveryRound, packingStores,
                                             deliveryReturnRoutes, utility,
                                             returnRouteService, log) {

			var vm = this;

			vm.query = '';
			vm.deliveryRound = deliveryRound;
			vm.deliveryReturnRoutes = deliveryReturnRoutes;
			vm.packingStores = packingStores;

			vm.getDocBy = function(driverId, deliveryDate) {
				return utility.takeFirst(vm.deliveryReturnRoutes
						.filter(function (row) {
							return (row.driverID === driverId && row.deliveryDate === deliveryDate);
						}));
			};

			vm.saveRow = function ($data, driverId, deliveryDate) {
				var doc = vm.getDocBy(driverId, deliveryDate);
				if(doc){
					for(var k in $data){
						var value = $data[k];
						if(value){
							doc[k] = value;
						}
					}
					return returnRouteService.save(doc)
							.then(function (res){
								doc = res;
								log.success('returnRouteSaved');
							})
							.catch(returnRouteService.onSaveError);
				}
			};

		});