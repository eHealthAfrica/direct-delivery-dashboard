'use strict'

;(function (angular) {
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

  var locationMock = [
    {
      'id': 'LGAID-STATEID',
      'key': ['3', 'STATEID'],
      'value': null,
      'doc': {
        '_id': 'LGAID-STATEID',
        '_rev': 'uuid',
        'doc_type': 'location',
        'level': '3',
        'name': 'LGA-Name',
        'ancestors': ['COUNTRYID', 'ZONEID', 'STATEID']
      }
    }
  ]

  var byRoundMock = [
    {
      'id': 'id1',
      'key': ['round1', 'LGAID'],
      'value': {
        'status': 'success',
        'date': '2016-01-29',
        'zone': 'Rano',
        'lga': 'Bebeji',
        'ward': 'Kuki',
        'deliveryRoundID': 'STATEID-23-2015',
        'count': 1,
        driverID: 'driver.name@domain.com'
      }
    }
  ]

  var byDateMock = [
    {
      'id': 'id1',
      'key': ['2015-04-27', 'round1', 'LGA-Name'],
      value: byRoundMock[0].value
    }
  ]

  angular.module('reportsMock', [])
    .constant('deliveryRounds', deliveryRounds)
    .constant('dailyDeliveries', dailyDeliveries)
    .service('authService', function ($q) {
      this.getUserSelectedState = function () {
        return $q.when('State1')
      }
    })
    .factory('dbService', function ($q) {
      return {
        getView: function (view) {
          var response = null

          switch (view) {
            case 'reports/delivery-rounds':
              response = {
                rows: deliveryRounds
              }
              break

            case 'reports/delivery-rounds-count':
              response = {
                rows: deliveryRoundCount
              }
              break

            case 'reports/daily-deliveries':
              response = {
                rows: dailyDeliveries
              }
              break

            case 'reports/daily-deliveries-count':
              response = {
                rows: dailyDeliveryCount
              }
              break
            case 'reports/by-rounds':
              response = {
                rows: byRoundMock
              }
              break

            case 'location/by-level-and-ancestors-id':
              response = {
                rows: locationMock
              }
              break

            case 'dashboard-delivery-rounds/report-by-date':
              response = {
                rows: byDateMock
              }
              break

            case 'dashboard-delivery-rounds/by-state-and-end-date':
              response = {
                rows: [
                  {
                    'id': 'KN-20',
                    'key': ['Kano', '2015-04-23'],
                    'value': null
                  }
                ]
              }
              break

            default:
              break
          }

          var deferred = $q.defer()
          deferred.resolve(response)

          return deferred.promise
        }
      }
    })
}(angular))
