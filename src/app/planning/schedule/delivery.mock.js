angular.module('deliveryMock', [])
		.constant('deliveryRoundMock', {
			"_id": "KN-21-2015",
			"_rev": "11-7165fe5f9896f1f3258fbcd3555ad60b",
			"roundCode": "KN-21-2015",
			"doc_type": "deliveryRound",
			"startDate": "2015-04-27",
			"endDate": "2015-06-10",
			"state": "Kano",
			"status": "active",
			"version": "2.0.0",
			"worksheetId": "xxxxxxx",
			"spreadsheetId": "xxxxxxxxxxxxxxx-gghhhhhh",
			"importedAt": "2015-05-16T12:03:26.719Z",
			"roundNo": "21",
			"createdOn": "2015-06-24T11:41:33.586Z",
			"modifiedOn": "2015-06-24T11:47:41.402Z"
		})
		.constant('dailyDeliveriesMock', [
			{
				"_id": "d3a16874da59f7b40cab3eadd41ac085",
				"deliveryRoundID": "KN-21-2015",
				"facility": {
					"zone": "Bichi",
					"lga": "Gwarzo",
					"ward": "Kutama",
					"name": "Test Fac 1",
					"id": "KNS THF - JIK",
					"contact": "Test Driver Name",
					"phoneNo": '0801234567'
				},
				"date": "2015-04-27",
				"driverID": "bashir@example.com",
				"drop": 1,
				"window": "9AM-11AM",
				"status": "Success: 1st attempt"
			},
			{
				"_id": "d3a16874da59f7b40cab3eadd41672892",
				"deliveryRoundID": "KN-21-2015",
				"facility": {
					"zone": "Bichi",
					"lga": "Gwarzo",
					"ward": "Kutama",
					"name": "Test Fac 2",
					"id": "KNS THF - FAC",
					"contact": "Test Driver Name",
					"phoneNo": '0801234567'
				},
				"date": "2015-04-27",
				"driverID": "bashir@example.com",
				"drop": 1,
				"window": "9AM-11AM",
				"status": "Success: 1st attempt"
			}
		])
		.constant('csvResultMock', [
			{
				"UUID": "d3a16874da59f7b40cab3eadd41ac085",
				"Round Code": "KN-21-2015",
				"Facility Name": "Test Fac 1",
				"Facility Code": "KNS THF - JIK",
				"Delivery Date": "2015-04-27",
				"Driver ID": "bashir@example.com",
				"Drop": "1",
				"Distance (KM)": "203",
				"Window": "9am - 11am"
			},
			{
				"UUID": "d3a16874da59f7b40cab3eadd41ac085",
				"Round Code": "KN-21-2015",
				"Facility Name": "Test Fac 2",
				"Facility Code": "KNS THF - FAC",
				"Delivery Date": "2015-09-08",
				"Driver ID": "bashir@example.com",
				"Drop": "",
				"Distance (KM)": "",
				"Window": ""
			}
		]);