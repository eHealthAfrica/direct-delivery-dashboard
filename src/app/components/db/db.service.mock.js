'use strict';

(function (angular) {
  var deliveryRounds = [
    {
      id: 'round1',
      key: ['State1', '2015-01-01'],
      value: {
        roundCode: 'RC1',
        endDate: new Date('2015-01-13'),
        id: 'round1',
        state: 'State1',
        startDate: new Date('2015-01-01')
      }
    },
    {
      id: 'round2',
      key: ['State2', '2015-01-01'],
      value: {
        roundCode: 'RC1',
        endDate: new Date('2015-01-13'),
        id: 'round1',
        state: 'State1',
        startDate: new Date('2015-01-01')
      }
    }
  ]

  var reportByRoundMock = [
    {
      id: '1b03d0925529656b4c83caed460aa54e',
      key: [
        'BA-008-2015',
        '1970-01-01'
      ],
      value: {
        status: 'Canceled: Staff availability',
        zone: 'Nassarawa',
        onTime: 1,
        billable: 0,
        workingCCE: 1,
        delivered: 0,
        howMuchLate: 'UNKNOWN',
        lag: 2
      }
    },
    {
      id: '1b03d0925529656b4c83caed460e055b',
      key: [
        'BA-1-2015',
        '1970-01-01'
      ],
      value: {
        status: 'Upcoming: 1st Attempt',
        zone: 'Nassarawa',
        onTime: 1,
        billable: 0,
        workingCCE: 1,
        delivered: 0,
        howMuchLate: 'UNKNOWN',
        lag: 1
      }
    },
    {
      id: '5228bb1535f9cad3d3f6a6133ed9157f',
      key: [
        'BA-1-2015',
        '2015-08-03'
      ],
      value: {
        status: 'Success: 1st Attempt',
        zone: 'Southern',
        onTime: 1,
        billable: 1,
        workingCCE: 1,
        delivered: 1,
        howMuchLate: -15943664,
        lag: 0
      }
    }
  ]
  var dailyDeliveries = [
    {
      id: 'delivery1',
      key: ['round1', 'driver1@example.com', '2015-01-01', 1],
      value: {
        id: 'delivery1',
        drop: 1,
        date: new Date('2015-01-01'),
        driverID: 'driver1@example.com',
        status: 'Success: 1st Attempt',
        window: '9AM-11AM',
        signature: {
          dataUrl: 'signature1',
          signedAt: '2015-01-01T08:42:38.708Z'
        },
        facility: {
          id: 'facility1',
          name: 'Facility 1',
          ward: 'Ward 1',
          lga: 'LGA 1',
          zone: 'Zone 1',
          contact: 'Facility 1 Contact',
          phoneNo: '123456789'
        }
      }
    },
    {
      id: 'delivery2',
      key: ['round1', 'driver1@example.com', '2015-01-01', 2],
      value: {
        drop: 2,
        date: new Date('2015-01-01'),
        id: 'delivery2',
        driverID: 'driver1@example.com',
        status: 'Failed: Staff availability',
        window: '11AM-1PM',
        facility: {
          id: 'facility2',
          name: 'Facility 2',
          ward: 'Ward 2',
          lga: 'LGA 1',
          zone: 'Zone 1',
          contact: 'Facility 2 Contact',
          phoneNo: '234567891'
        }
      }
    }
  ]

  var byRoundMock = [
    {
      'id': 'id1',
      'key': ['round1', 'ZONEID'],
      'value': {
        'status': 'success',
        'date': '2016-01-29',
        'zone': 'Zone 1',
        'lga': 'LGA 1',
        'ward': 'Kuki',
        'deliveryRoundID': 'round1',
        'count': 1,
        driverID: 'driver.name@domain.com'
      }
    },
    {
      'id': 'id2',
      'key': ['round1', 'ZONEID'],
      'value': {
        'status': 'success',
        'date': '2016-01-29',
        'zone': 'Zone 1',
        'lga': 'LGA 1',
        'ward': 'Ward 1',
        'deliveryRoundID': 'round1',
        'count': 1,
        driverID: 'driver.name@domain.com'
      }
    },
    {
      'id': 'id3',
      'key': ['round2', 'ZONEID'],
      'value': {
        'status': 'success',
        'date': '2016-01-29',
        'zone': 'Zone 2',
        'lga': 'LGA 2',
        'ward': 'Ward 2',
        'deliveryRoundID': 'round2',
        'count': 1,
        driverID: 'driver.name@domain.com'
      }
    }
  ]

  var byDateMock = [
    {
      'id': 'id1',
      'key': ['2015-04-27', 'round1', 'ZONEID'],
      value: byRoundMock[0].value
    },
    {
      'id': 'id2',
      'key': ['2015-04-27', 'round1', 'ZONEID'],
      value: byRoundMock[1].value
    },
    {
      'id': 'id3',
      'key': ['2015-04-27', 'round1', 'ZONEID'],
      value: byRoundMock[2].value
    }

  ]

  var locationMock = [
    {
      'id': 'ZONEID-STATEID',
      'key': ['3', 'State1'],
      'value': null,
      'doc': {
        '_id': 'ZONEID-STATEID',
        'doc_type': 'location',
        'level': '3',
        'name': 'Zone 1',
        'ancestors': ['COUNTRYID', 'ZONEID', 'STATEID']
      }
    }
  ]

  var facilityCCEStatusMock = [
    {
      'id': 'id1',
      'key': ['2015-01-01', 'round1'],
      'value': {
        'status': 'upcoming',
        'reason': '1st attempt',
        'workingCCE': true,
        'name': 'Facility 1',
        'zone': 'Zone 1',
        'lga': 'LGA 1',
        'ward': 'Ward 1'
      }
    },
    {
      'id': 'id2',
      'key': ['2015-01-01', 'round1'],
      'value': {
        'status': 'success',
        'reason': '1st attempt',
        'workingCCE': false,
        'name': 'Facility 2',
        'zone': 'Zone 2',
        'lga': 'LGA 1',
        'ward': 'Ward 2'
      }
    },
    {
      'id': 'id3',
      'key': ['2015-01-01', 'round2'],
      'value': {
        'status': 'failed',
        'reason': '1st attempt',
        'workingCCE': true,
        'name': 'Facility 1',
        'zone': 'Zone 1',
        'lga': 'LGA 1',
        'ward': 'Ward 1'
      }
    }
  ]

  var deliveryRoundCount = [
    {
      id: 'State1',
      key: null,
      value: deliveryRounds.length
    }
  ]

  var dailyDeliveryCount = [
    {
      id: 'round1',
      key: null,
      value: dailyDeliveries.length
    }
  ]

  var emailReceiversMock = [
    {
      id: '7ab9f02f1d61f74666517af7aa001d94',
      key: 'all',
      value: {
        _id: '7ab9f02f1d61f74666517af7aa001d94',
        _rev: '10-0ab1fd86f9ecebbf362add6aef19cb44',
        active: true,
        doc_type: 'alert-receiver',
        phones: [ ],
        emails: [
          'adam@ehealthafrica.org'
        ],
        name: 'Adam Thompson',
        locations: [
          'all'
        ]
      }
    },
    {
      id: '4cd167a74113b70dced1395b6a000185',
      key: 'BA',
      value: {
        _id: '4cd167a74113b70dced1395b6a000185',
        _rev: '2-931aa691f68b6bcc0d255e0628bed74c',
        active: true,
        doc_type: 'alert-receiver',
        phones: [ ],
        emails: [
          'usman.inuwa@ehealthnigeria.org'
        ],
        name: 'Usman Inuwa',
        locations: [
          'KN',
          'BA'
        ]
      }
    },
    {
      id: '4cd167a74113b70dced1395b6a000185',
      key: 'KN',
      value: {
        _id: '4cd167a74113b70dced1395b6a000185',
        _rev: '2-931aa691f68b6bcc0d255e0628bed74c',
        active: true,
        doc_type: 'alert-receiver',
        phones: [ ],
        emails: [
          'usman.inuwa@ehealthnigeria.org'
        ],
        name: 'Usman Inuwa',
        locations: [
          'KN',
          'BA'
        ]
      }
    }
  ]

  var packingReportMock = [
    {
      'id': 'id1',
      'key': ['2015-01-01', 'round1'],
      'value': {
        'zone': 'Zone 1',
        'lga': 'LGA 1',
        'ward': 'Ward 1',
        'name': 'Name 1',
        'id': 'round1',
        'contact': 'Sani Umar',
        'phoneNo': 8065076683,
        'productID': 'product1',
        'expectedQty': 132,
        'baseUOM': 'Units',
        'presentation': 1,
        'storageID': 'product-storage/dry',
        'returnedQty': 0,
        'onHandQty': 132,
        'deliveredQty': 0
      }
    },
    {
      'id': 'id2',
      'key': ['2015-01-01', 'round1'],
      'value': {
        'zone': 'Zone 1',
        'lga': 'LGA 1',
        'ward': 'Ward 1',
        'name': 'Name 1',
        'id': 'round1',
        'contact': 'Sani Umar',
        'phoneNo': 8065076683,
        'productID': 'product2',
        'expectedQty': 132,
        'baseUOM': 'Units',
        'presentation': 1,
        'storageID': 'product-storage/dry',
        'returnedQty': 0,
        'onHandQty': 132,
        'deliveredQty': 0
      }
    }
  ]

  var productsMock = [
    {
      'id': 'product1',
      'key': 'product1',
      'value': null,
      'doc': {
        '_id': 'product1',
        'doc_type': 'product',
        'name': 'Product 1',
        'code': 'product1',
        'description': '1',
        'baseUOM': 'Units',
        'storageID': 'product-storage/dry'
      }
    },
    {
      'id': 'product2',
      'key': 'product2',
      'value': null,
      'doc': {
        '_id': 'product2',
        'doc_type': 'product',
        'name': 'Product 2',
        'code': 'product2',
        'description': '1',
        'baseUOM': 'Units',
        'storageID': 'product-storage/dry'
      }
    }

  ]

  angular.module('dbServiceMock', [])
    .constant('dailyDeliveries', dailyDeliveries)
    .constant('deliveryRounds', deliveryRounds)
    .constant('dailyDeliveriesByDate', byDateMock)
    .constant('dailyDeliveriesByRound', byRoundMock)
    .factory('dbService', function ($q) {
      return {
        getView: function (view) {
          var response = null
          if (['reports/delivery-rounds', 'dashboard-delivery-rounds/by-state-and-end-date', 'delivery-rounds/by-state-code'].indexOf(view) !== -1) {
            response = {
              rows: deliveryRounds
            }
          } else if (['dashboard-delivery-rounds/report-by-date'].indexOf(view) !== -1) {
            response = {
              rows: byDateMock
            }
          } else if (['dashboard-delivery-rounds/report-by-round'].indexOf(view) !== -1) {
            response = {
              rows: reportByRoundMock
            }
          } else if (['reports/by-rounds'].indexOf(view) !== -1) {
            response = {
              rows: byRoundMock
            }
          } else if (['location/by-level', 'location/by-level-and-id'].indexOf(view) !== -1) {
            response = {
              rows: locationMock
            }
          } else if (['dashboard-delivery-rounds/alert-receivers'].indexOf(view) !== -1) {
            response = {
              rows: emailReceiversMock,
              docs: emailReceiversMock
            }
          } else if (view === 'location/by-level-and-ancestors-id') {
            response = {
              rows: locationMock
            }
          } else if (view === 'dashboard-delivery-rounds/report-by-date') {
            response = {
              rows: byDateMock
            }
          } else if (view === 'facilities/cce-status-by-date') {
            response = {
              rows: facilityCCEStatusMock
            }
          } else if (view === 'reports/delivery-rounds-count') {
            response = {
              rows: deliveryRoundCount
            }
          } else if (view === 'reports/daily-deliveries-count') {
            response = {
              rows: dailyDeliveryCount
            }
          } else if (view === 'reports/daily-deliveries') {
            response = {
              rows: dailyDeliveries
            }
          } else if (['reports/packing-by-date', 'reports/packing-by-round'].indexOf(view) !== -1) {
            response = {
              rows: packingReportMock
            }
          } else if (view === 'products/products') {
            response = {
              rows: productsMock
            }
          }

          var deferred = $q.defer()
          deferred.resolve(response)
          return deferred.promise
        },
        get: function (id) {
          var deferred = $q.defer()
          deferred.resolve({
            _id: id
          })
          return deferred.promise
        },
        save: function (doc) {
          var deferred = $q.defer()
          deferred.resolve(angular.extend(doc, {
            _rev: '1-01'
          }))
          return deferred.promise
        },
        insertWithId: function (doc, id) {
          doc._id = id
          var deferred = $q.defer()
          deferred.resolve(angular.extend(doc, {
            _rev: '1-01'
          }))
          return deferred.promise
        }
      }
    })
}(angular))
