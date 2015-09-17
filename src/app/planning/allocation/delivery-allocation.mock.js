'use strict';

angular.module('deliveryAllocationMock', [])
		.constant('facilityAllocationInfoMock', {
			rows: [{
				"_id": "18d13ea4fb9088959921e8794eadb5ed",
				"facility": {
					"zone": "Wudil",
					"lga": "Test LGA",
					"ward": "Test Ward",
					"name": "Test Health Post",
					"id": "KNS Test 101",
					"contact": "Test Person",
					"phoneNo": 80123456789
				},
				"packedProduct": {
					"BCG": {
						"productID": "BCG",
						"expectedQty": 120,
						"baseUOM": "Doses",
						"presentation": 20,
						"storageID": "product-storage/frozen"
					},
					"MV": {
						"productID": "MV",
						"expectedQty": 60,
						"baseUOM": "Doses",
						"presentation": 10,
						"storageID": "product-storage/frozen"
					},
					"YF": {
						"productID": "YF",
						"expectedQty": 60,
						"baseUOM": "Doses",
						"presentation": 10,
						"storageID": "product-storage/frozen"
					},
					"OPV": {
						"productID": "OPV",
						"expectedQty": 240,
						"baseUOM": "Doses",
						"presentation": 10,
						"storageID": "product-storage/frozen"
					},
					"IPV": {
						"productID": "IPV",
						"expectedQty": 60,
						"baseUOM": "Doses",
						"presentation": 10,
						"storageID": "product-storage/refrigerator"
					},
					"TT": {
						"productID": "TT",
						"expectedQty": 300,
						"baseUOM": "Doses",
						"presentation": 10,
						"storageID": "product-storage/refrigerator"
					},
					"Penta": {
						"productID": "Penta",
						"expectedQty": 180,
						"baseUOM": "Doses",
						"presentation": 10,
						"storageID": "product-storage/refrigerator"
					},
					"HBV": {
						"productID": "HBV",
						"expectedQty": 60,
						"baseUOM": "Doses",
						"presentation": 10,
						"storageID": "product-storage/refrigerator"
					},
					"YF Dil": {
						"productID": "YF Dil",
						"expectedQty": 6,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/refrigerator"
					},
					"MV Dil": {
						"productID": "MV Dil",
						"expectedQty": 6,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/refrigerator"
					},
					"BCG Dil": {
						"productID": "BCG Dil",
						"expectedQty": 6,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/refrigerator"
					},
					"0.05ml": {
						"productID": "0.05ml",
						"expectedQty": 132,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/dry"
					},
					"0.5ml": {
						"productID": "0.5ml",
						"expectedQty": 792,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/dry"
					},
					"RC 2ml": {
						"productID": "RC 2ml",
						"expectedQty": 7,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/dry"
					},
					"RC 5ml": {
						"productID": "RC 5ml",
						"expectedQty": 14,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/dry"
					},
					"Safety Boxes": {
						"productID": "Safety Boxes",
						"expectedQty": 11,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/dry"
					},
					"Droppers": {
						"productID": "Droppers",
						"expectedQty": 12,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/dry"
					},
					"Cards": {
						"productID": "Cards",
						"expectedQty": 120,
						"baseUOM": "Units",
						"presentation": 1,
						"storageID": "product-storage/dry"
					}
				}
			}],
			lgaList: ['Test LGA'],
			productList: [ "BCG", "MV", "YF", "OPV", "IPV", "TT", "Penta", "HBV", "YF Dil", "MV Dil", "BCG Dil", "0.05ml", "0.5ml", "RC 2ml", "RC 5ml", "Safety Boxes", "Droppers", "Cards"]
		});