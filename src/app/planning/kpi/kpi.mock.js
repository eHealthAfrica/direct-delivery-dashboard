'use strict'

angular.module('kpiMock', [])
	.constant('kpiTemplatesMock', [
		{
			"_id": "kpi-template-1",
			"name": "Number Immunized",
			"outreachSessions": "",
			"notes": "",
			"doc_type": "kpi-template",
			"date": "",
			"originRow": "",
			"deliveryRoundID": "",
			"driverID": "",
			"version": "2.0.0",
			"worksheetId": "ojuogcm",
			"spreadsheetId": "",
			"importedAt": "",
			"antigensKPI": [
				{
					"productID": "BCG",
					"noImmunized": 0
				},
				{
					"productID": "MV",
					"noImmunized": 0
				},
				{
					"productID": "OPV",
					"noImmunized": 0
				},
				{
					"productID": "IPV",
					"noImmunized": 0
				},
				{
					"productID": "TT",
					"noImmunized": 0
				},
				{
					"productID": "Penta",
					"noImmunized": 0
				},
				{
					"productID": "HBV",
					"noImmunized": 0
				},
				{
					"productID": "YF",
					"noImmunized": 0
				}
			],
			"facility": {
				"zone": "",
				"lga": "",
				"ward": "",
				"name": "",
				"id": ""
			}
		}
	])
	.constant('kpiInfoMock', {
		"antigens": [
			"BCG",
			"MV",
			"OPV",
			"IPV",
			"TT",
			"Penta",
			"HBV",
			"YF"
		],
		kpiList: [
			{
				"_id": "0f56b4f46d2474b990a43721090004cb",
				"_rev": "30-4d48c732226ac3b6dddc5e87f2fbca01",
				"outreachSessions": "4",
				"notes": "3 outreach sessions and 2 fixed session!",
				"doc_type": "kpi",
				"date": "2015-07-06",
				"originRow": "2",
				"deliveryRoundID": "BA-1-2015",
				"driverID": "bashir@example.com",
				"version": "2.0.0",
				"worksheetId": "ojuogcm",
				"spreadsheetId": "1HqYAgB3O9b8jaCUKnvZwAx2C8pr79KwlA2hjemQcU_A",
				"importedAt": "2015-06-29T11:07:36.040Z",
				"facility": {
					"zone": "Test Zone",
					"lga": "Test LGA",
					"ward": "Test Ward",
					"name": "Test HF 1",
					"id": "TEST HF 101"
				},
				"createdOn": "2015-10-16T14:09:59.006Z",
				"modifiedOn": "2015-10-16T15:33:36.075Z",
				"antigensKPI": [
					{
						"productID": "BCG",
						"noImmunized": 35
					},
					{
						"productID": "MV",
						"noImmunized": 0
					},
					{
						"productID": "OPV",
						"noImmunized": 0
					},
					{
						"productID": "IPV",
						"noImmunized": 0
					},
					{
						"productID": "TT",
						"noImmunized": 0
					},
					{
						"productID": "Penta",
						"noImmunized": 0
					},
					{
						"productID": "HBV",
						"noImmunized": 0
					},
					{
						"productID": "YF",
						"noImmunized": 0
					}
				]
			},
			{
				"_id": "0f56b4f46d2474b990a43721090007ee",
				"_rev": "1-f95b34c9f710dc5868320a53575bff96",
				"outreachSessions": "",
				"notes": "",
				"doc_type": "kpi",
				"date": "2015-07-06",
				"originRow": "3",
				"deliveryRoundID": "BA-1-2015",
				"driverID": "bashir@example.com",
				"version": "2.0.0",
				"worksheetId": "ojuogcm",
				"spreadsheetId": "1HqYAgB3O9b8jaCUKnvZwAx2C8pr79KwlA2hjemQcU_A",
				"importedAt": "2015-06-29T11:07:36.040Z",
				"antigensKPI": [
					{
						"productID": "BCG",
						"noImmunized": 0
					},
					{
						"productID": "MV",
						"noImmunized": 0
					},
					{
						"productID": "OPV",
						"noImmunized": 0
					},
					{
						"productID": "IPV",
						"noImmunized": 0
					},
					{
						"productID": "TT",
						"noImmunized": 0
					},
					{
						"productID": "Penta",
						"noImmunized": 0
					},
					{
						"productID": "HBV",
						"noImmunized": 0
					},
					{
						"productID": "YF",
						"noImmunized": 0
					}
				],
				"facility": {
					"zone": "Test Zone",
					"lga": "Test LGA",
					"ward": "Test Ward",
					"name": "Test HF 2",
					"id": "Test HF 102"
				}
			}
		]
	})
