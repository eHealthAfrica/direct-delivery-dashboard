angular.module('scheduleMock', [])
		.constant('headerMock', {
			uuid: {
				text: 'UUID',
				index: 0
			}
			,
			roundCode: {
				text: 'Round Code',
				index: 1
			}
			,
			facilityName: {
				text: 'Facility Name',
				index: 2
			}
			,
			facilityCode: {
				text: 'Facility Code',
				index: 3
			}
			,
			deliveryDate: {
				text: 'Delivery Date',
				index: 4
			}
			,
			driverID: {
				text: 'Driver ID',
				index: 5
			}
			,
			drop: {
				text: 'Drop',
				index: 6
			}
			,
			distance: {
				text: 'Distance (KM)',
				index: 7
			}
			,
			window: {
				text: 'Window',
				index: 8
			}
		})
		.constant('csvExportMock', {
			"rows": [
				{
					"uuid": "d3a16874da59f7b40cab3eadd41ac085",
					"roundId": "KN-21-2015",
					"facilityName": "Test Fac 1",
					"facilityCode": "KNS THF - JIK",
					"deliveryDate": "2015-04-27",
					"driver": "bashir@example.com",
					"drop": 1,
					"window": "9AM-11AM"
				},
				{
					"uuid": "d3a16874da59f7b40cab3eadd41672892",
					"roundId": "KN-21-2015",
					"facilityName": "Test Fac 2",
					"facilityCode": "KNS THF - FAC",
					"deliveryDate": "2015-04-27",
					"driver": "bashir@example.com",
					"drop": 1,
					"window": "9AM-11AM"
				}
			],
			"headers": [
				"UUID",
				"Round Code",
				"Facility Name",
				"Facility Code",
				"Delivery Date",
				"Driver ID",
				"Drop",
				"Distance (KM)",
				"Window"
			]
		})
		.constant('nestedDeliveryMock', [
			{
				"_id": "d8006b0524473a0a4a60b7749766a11d",
				"_rev": "5-fda8a9891698cfb1beff7a06c78470cb",
				"doc_type": "dailyDelivery",
				"version": "1.0.0",
				"deliveryRoundID": "d8006b0524473a0a4a60b7749766a11e",
				"driverID": "abdullahi.ahmed@example.com",
				"date": "",
				"facilityRounds": [
					{
						"drop": "",
						"facility": {
							"id": "00adca90da3e44c4fff1166a2b146662",
							"name": "Test Facility",
							"lga": "Test LGA",
							"zone": "Test Zone",
							"ward": "Test Ward",
							"contact": "Test person",
							"phoneNo": "080123456789"
						},
						"status": "pending",
						"window": "",
						"cancelReport": {},
						"arrivedAt": "",
						"departedAt": "",
						"packedProduct": [
							{
								"productID": "BCG",
								"expectedQty": 70,
								"storageID": "product-storage/frozen",
								"presentation": 20,
								"receivedInterimStock": false
							},
							{
								"productID": "Men-A",
								"expectedQty": 150,
								"storageID": "product-storage/dry",
								"presentation": 20,
								"receivedInterimStock": false
							},
							{
								"productID": "OPV",
								"expectedQty": 34,
								"storageID": "product-storage/frozen",
								"presentation": 20,
								"receivedInterimStock": false
							}
						],
						"facilityKPI": {
							"outreachSessions": 0,
							"notes": "",
							"antigensKPI": [
								{
									"productID": "BCG",
									"noImmuized": 0
								},
								{
									"productID": "Men-A",
									"noImmuized": 0
								},
								{
									"productID": "OPV",
									"noImmuized": 0
								}
							]
						}
					},
					{
						"drop": "",
						"facility": {
							"id": "59feeb58df154a5f9d4641e46d8d0b71",
							"name": "Test Fac 2",
							"zone": "Nassarawa",
							"ward": "Ketawa",
							"lga": "Gezawa",
							"contact": "test person 3",
							"phoneNo": "080090900000"
						},
						"status": "pending",
						"cancelReport": {},
						"arrivedAt": "",
						"departedAt": "",
						"packedProduct": [
							{
								"productID": "BCG",
								"expectedQty": 70,
								"storageID": "product-storage/frozen",
								"presentation": 20,
								"receivedInterimStock": false
							},
							{
								"productID": "Men-A",
								"expectedQty": 150,
								"storageID": "product-storage/dry",
								"presentation": 20,
								"receivedInterimStock": false
							},
							{
								"productID": "OPV",
								"expectedQty": 34,
								"storageID": "product-storage/frozen",
								"presentation": 20,
								"receivedInterimStock": false
							}
						],
						"facilityKPI": {
							"outreachSessions": 0,
							"notes": "",
							"antigensKPI": [
								{
									"productID": "BCG",
									"noImmuized": 0
								},
								{
									"productID": "Men-A",
									"noImmuized": 0
								},
								{
									"productID": "OPV",
									"noImmuized": 0
								}
							]
						}
					},
					{
						"drop": "",
						"facility": {
							"id": "120bb6044ac34de9d950dcee9f571ea9",
							"name": "Test HF 3",
							"lga": "Dala",
							"zone": "Nassarawa",
							"contact": "Contact Person Name",
							"phoneNo": "012345678s",
							"ward": "Gwammaja"
						},
						"status": "pending",
						"cancelReport": {},
						"arrivedAt": "",
						"departedAt": "",
						"packedProduct": [
							{
								"productID": "BCG",
								"expectedQty": 70,
								"storageID": "product-storage/frozen",
								"presentation": 20,
								"receivedInterimStock": false
							},
							{
								"productID": "Men-A",
								"expectedQty": 150,
								"storageID": "product-storage/dry",
								"presentation": 20,
								"receivedInterimStock": false
							},
							{
								"productID": "OPV",
								"expectedQty": 34,
								"storageID": "product-storage/frozen",
								"presentation": 20,
								"receivedInterimStock": false
							}
						],
						"facilityKPI": {
							"outreachSessions": 0,
							"notes": "",
							"antigensKPI": [
								{
									"productID": "BCG",
									"noImmuized": 0
								},
								{
									"productID": "Men-A",
									"noImmuized": 0
								},
								{
									"productID": "OPV",
									"noImmuized": 0
								}
							]
						}
					}
				],
				"packingList": [
					{
						"productID": "BCG",
						"expectedQty": 210,
						"storageID": "product-storage/frozen",
						"presentation": 20,
						"receivedInterimStock": false
					},
					{
						"productID": "Men-A",
						"expectedQty": 450,
						"storageID": "product-storage/dry",
						"presentation": 20,
						"receivedInterimStock": false
					},
					{
						"productID": "OPV",
						"expectedQty": 102,
						"storageID": "product-storage/frozen",
						"presentation": 20,
						"receivedInterimStock": false
					}
				]
			}
		])
		.constant('flatDeliveries', [
			{
				"_id": "d8006b0524473a0a4a60b7749766a11d",
				"facility": {
					"id": "00adca90da3e44c4fff1166a2b146662",
					"name": "Test Facility",
					"lga": "Test LGA",
					"zone": "Test Zone",
					"ward": "Test Ward",
					"contact": "Test person",
					"phoneNo": "080123456789"
				},
				"date": "",
				"driverID": "abdullahi.ahmed@example.com",
				"drop": "",
				"window": "",
				"status": "pending"
			},
			{
				"_id": "d8006b0524473a0a4a60b7749766a11d",
				"facility": {
					"id": "59feeb58df154a5f9d4641e46d8d0b71",
					"name": "Test Fac 2",
					"zone": "Nassarawa",
					"ward": "Ketawa",
					"lga": "Gezawa",
					"contact": "test person 3",
					"phoneNo": "080090900000"
				},
				"date": "",
				"driverID": "abdullahi.ahmed@example.com",
				"drop": "",
				"status": "pending"
			},
			{
				"_id": "d8006b0524473a0a4a60b7749766a11d",
				"facility": {
					"id": "120bb6044ac34de9d950dcee9f571ea9",
					"name": "Test HF 3",
					"lga": "Dala",
					"zone": "Nassarawa",
					"contact": "Contact Person Name",
					"phoneNo": "012345678s",
					"ward": "Gwammaja"
				},
				"date": "",
				"driverID": "abdullahi.ahmed@example.com",
				"drop": "",
				"status": "pending"
			}
		])
		.constant('updatedDailyDeliveryMock', [{
			"_id": "d8006b0524473a0a4a60b7749766a11d",
			"facility": {
				"id": "00adca90da3e44c4fff1166a2b146662",
				"name": "Test Facility",
				"lga": "Test LGA",
				"zone": "Test Zone",
				"ward": "Test Ward",
				"contact": "Test person",
				"phoneNo": "080123456789"
			},
			"date": "",
			"driverID": "abdullahi.ahmed@example.com",
			"drop": "",
			"window": "",
			"status": "pending"
		}, {
			"_id": "d8006b0524473a0a4a60b7749766a11d",
			"facility": {
				"id": "59feeb58df154a5f9d4641e46d8d0b71",
				"name": "Test Fac 2",
				"zone": "Nassarawa",
				"ward": "Ketawa",
				"lga": "Gezawa",
				"contact": "test person 3",
				"phoneNo": "080090900000"
			},
			"date": "",
			"driverID": "abdullahi.ahmed@example.com",
			"drop": "",
			"status": "pending"
		}, {
			"_id": "d8006b0524473a0a4a60b7749766a11d",
			"facility": {
				"id": "120bb6044ac34de9d950dcee9f571ea9",
				"name": "Test HF 3",
				"lga": "Dala",
				"zone": "Nassarawa",
				"contact": "Contact Person Name",
				"phoneNo": "012345678s",
				"ward": "Gwammaja"
			},
			"date": "",
			"driverID": "abdullahi.ahmed@example.com",
			"drop": "",
			"status": "pending"
		}]);
