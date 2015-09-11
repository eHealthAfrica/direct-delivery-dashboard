angular.module('planning')
		.service('deliveryAllocationService', function (dbService, utility, pouchUtil) {

			var _this = this;

			_this.update = function(docId, facilityId, packedProductHash){
				return dbService.get(docId)
						.then(function (doc) {
							var facRnd = doc;
							if(angular.isArray(doc.facilityRounds)){
								facRnd = null;
								for(var i in doc.facilityRounds){
									var temp = doc.facilityRounds[i];
									if(temp.facility && temp.facility.id === facilityId){
										facRnd = temp;
										break;
									}
								}
							}
							if(!facRnd.packedProduct){
								facRnd.packedProduct = [];
							}
							var ppHash = utility.hashBy(facRnd.packedProduct, 'productID');
							var expectedQty;
							var updatedPackedProducts = [];
							for (var k in packedProductHash) {
								expectedQty = packedProductHash[k];
								var packedProduct = ppHash[k];
								if(packedProduct){
									packedProduct.expectedQty = expectedQty;
									updatedPackedProducts.push(packedProduct);
								}
							}

							//else{
							//	facRnd.packedProduct = facRnd.packedProduct
							//			.map(function(pp) {
							//				var expectedQty = packedProductHash[pp.productID];
							//				if(angular.isNumber(expectedQty)){
							//					pp.expectedQty = expectedQty;
							//				}
							//				return pp;
							//			});
							//}
							//TODO: recalculate packing list quantity

						});
			};

			_this.getAllocationBy = function (roundId, lga) {
				var view = 'dashboard-delivery-rounds/facility-allocation-by-round';
				var params = {
					key: roundId
				};
				var uniqueProductList = [];
				var lgaList = [];
				return dbService.getView(view, params)
						.then(function (res) {
							if (res.rows.length === 0) {
								return pouchUtil.rejectIfEmpty(res.rows)
							}
							var resultSet = res.rows.map(function (row) {
								row = row.value;
								var packedProductHash = {};
								if (angular.isArray(row.packedProduct)) {
									row.packedProduct.forEach(function (pp) {
										packedProductHash[pp.productID] = pp;
										if (uniqueProductList.indexOf(pp.productID) === -1) {
											uniqueProductList.push(pp.productID);
										}
									});
								}
								if(row.facility && row.facility.lga && lgaList.indexOf(row.facility.lga) === -1){
									lgaList.push(row.facility.lga);
								}
								row.packedProduct = packedProductHash;
								return row;
							}).filter(function(row){
								return row.facility && row.facility.lga === lga;
							});
							return {
								rows: resultSet,
								productList: uniqueProductList,
								lgaList: lgaList.sort()
							}
						});
			};

		});