angular.module('planning')
		.service('deliveryAllocationService', function (dbService, $q, utility, pouchUtil, log) {

			var _this = this;

			function getDefaultPacked(pType, expectedQty) {
				//TODO: new item add to list
				//TODO: add presentation if available and also unit of measurement, along with category,
				//use product list
				return {
					productID: pType,
					expectedQty: expectedQty
				};
			}

			function updateProductAllocs(facRnd, qtyByProductHash) {
				if (!facRnd.packedProduct) {
					facRnd.packedProduct = [];
				}
				var ppHash = utility.hashBy(facRnd.packedProduct, 'productID');
				var expectedQty;
				var updatedPackedProducts = [];
				for (var k in qtyByProductHash) {
					expectedQty = qtyByProductHash[k];
					var packedProduct = ppHash[k];
					if (packedProduct) {
						packedProduct.expectedQty = expectedQty;
						updatedPackedProducts.push(packedProduct);
					} else {
						updatedPackedProducts.push(getDefaultPacked(k, expectedQty));
					}
				}
				facRnd.packedProduct = updatedPackedProducts;
				return facRnd;
			}

			_this.onUpdateError = function (err) {
				if (err.status === 401) {
					return log.error('unauthorizedAccess', err);
				}
				if (err.status === 409) {
					return log.error('updateConflict', err);
				}
				log.error('updatePackedQtyErr', err);
			};

			_this.update = function (docId, facilityId, packedProductHash) {
				return dbService.get(docId)
						.then(function (doc) {
							var updatedDoc;
							var facRnd = doc;
							if (angular.isArray(doc.facilityRounds)) {
								facRnd = null;
								for (var i in doc.facilityRounds) {
									var temp = doc.facilityRounds[i];
									if (temp.facility && temp.facility.id === facilityId) {
										facRnd = temp;
										doc.facilityRounds[i] = updateProductAllocs(facRnd, packedProductHash);
										updatedDoc = doc;
										break;
									}
								}
							} else {
								updatedDoc = updateProductAllocs(facRnd, packedProductHash);
							}
							if (angular.isObject(updatedDoc)) {
								return dbService.update(updatedDoc);
							}
							return $q.reject('updated document is not an object');
						});
			};

			function getByRound(roundId, view, include_docs) {
				var params = {
					key: roundId,
					include_docs: include_docs || false
				};
				return dbService.getView(view, params);
			}

			/**
			 * Uses first lga from lga list if an lga is not given.
			 *
			 * @param roundId
			 * @param lga
			 * @returns {*}
			 */
			_this.getAllocationBy = function (roundId, lga) {
				var uniqueProductList = [];
				var lgaList = [];
				var presentationsByProduct = {};
				var view = 'dashboard-delivery-rounds/facility-allocation-by-round';
				return getByRound(roundId, view)
						.then(function (res) {
							if (res.rows.length === 0) {
								return pouchUtil.rejectIfEmpty(res.rows);
							}
							var resultSet = res.rows.map(function (row) {
								row = row.value;
								var packedProductHash = {};
								if (angular.isArray(row.packedProduct)) {
									row.packedProduct.forEach(function (pp) {
										packedProductHash[pp.productID] = pp;
										//TODO: replace collating product id with delivery round packing list when completed
										if (uniqueProductList.indexOf(pp.productID) === -1) {
											uniqueProductList.push(pp.productID);
										}
										if (!presentationsByProduct[pp.productID] && angular.isNumber(pp.presentation)) {
											presentationsByProduct[pp.productID] = pp.presentation;
										}
									});
								}
								if (row.facility && row.facility.lga && lgaList.indexOf(row.facility.lga) === -1) {
									lgaList.push(row.facility.lga);
								}
								row.packedProduct = packedProductHash;
								return row;
							}).filter(function (row) {
								var selectedLGA = lga;
								if (!lga && lgaList.length > 0) {
									selectedLGA = utility.takeFirst(lgaList);
								}
								return row.facility && row.facility.lga === selectedLGA;
							});
							return {
								rows: resultSet,
								productList: uniqueProductList,
								lgaList: lgaList.sort(),
								presentationsByProduct: presentationsByProduct
							}
						});
			};

			_this.updatePresentation = function (packedProducts, presentationByProduct) {
				if (!angular.isArray(packedProducts)) {
					return packedProducts;
				}
				return packedProducts.map(function (pp) {
					var presentation = presentationByProduct[pp.productID];
					if (angular.isNumber(presentation)) {
						pp.presentation = presentation;
					}
					return pp;
				});
			};

			_this.updatePackedPresentation = function (roundId, presentationByProduct) {
				//get all daily delivery within the given roundId
				function updateDailyDoc(row) {
					var doc = row.doc;
					if (angular.isArray(doc.facilityRounds)) {
						doc.facilityRounds = doc.facilityRounds
								.map(function (facRnd) {
									facRnd.packedProduct = _this.updatePresentation(facRnd.packedProduct, presentationByProduct);
									return facRnd;
								});
					} else {
						doc.packedProduct = _this.updatePresentation(doc.packedProduct, presentationByProduct);
					}
					return doc;
				}

				var includeDocs = true;
				var view = 'dashboard-delivery-rounds/by-round-id';
				return getByRound(roundId, view, includeDocs)
						.then(function (res) {
							var updatedDocs = res.rows
									.map(updateDailyDoc);
							return dbService.saveDocs(updatedDocs);
						});
			};

			_this.updateFromTemplate = function (rows, templateAllocs) {
				var allocByFacilityId = {};
				templateAllocs.forEach(function (alloc) {
					if(alloc && alloc.MR && alloc._id){
						allocByFacilityId[alloc._id] = alloc.MR;
					}
				});

				return rows.map(function(row){
					if(!row.facility || !angular.isString(row.facility.id)){
						return row;
					}
					var facId = row.facility.id.split(' ').join('');
					if(!angular.isObject(row.packedProduct)){
						row.packedProduct = {};
					}

					var alloc = allocByFacilityId[facId];
					if(angular.isObject(alloc)){
						for(var k in alloc){
							if(!row.packedProduct[k]){
								var defaultQty = 0;
								row.packedProduct[k] = getDefaultPacked(k, defaultQty)
							}
							if(!angular.isNumber(row.packedProduct[k])){
								row.packedProduct[k].expectedQty = alloc[k];
							}
						}
					}
					return row;
				});
			};

		});