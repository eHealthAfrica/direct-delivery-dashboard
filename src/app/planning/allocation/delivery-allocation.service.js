angular.module('planning')
		.service('deliveryAllocationService', function (dbService, utility, pouchUtil) {

			var _this = this;

			_this.getAllocationBy = function (roundId) {
				var view = 'dashboard-delivery-rounds/facility-allocation-by-round';
				var params = {
					key: roundId
				};
				var uniqueProductList = [];
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
								row.packedProduct = packedProductHash;
								return row;
							});
							return {
								rows: resultSet,
								productList: uniqueProductList
							}
						});
			};

		});