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

  angular.module('dbServiceMock', [])
    .constant('deliveryRounds', deliveryRounds)
    .constant('dailyDeliveriesByDate', byDateMock)
    .constant('dailyDeliveriesByRound', byRoundMock)
    .factory('dbService', function ($q) {
      return {
        getView: function (view) {
          var response = null

          if (['reports/delivery-rounds', 'dashboard-delivery-rounds/by-state-and-end-date'].indexOf(view) !== -1) {
            response = {
              rows: deliveryRounds
            }
          } else if (view === 'dashboard-delivery-rounds/report-by-date') {
            response = {
              rows: byDateMock
            }
          } else if (view === 'reports/by-rounds') {
            response = {
              rows: byRoundMock
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
          }

          var deferred = $q.defer()
          deferred.resolve(response)

          return deferred.promise
        }
      }
    })
}(angular))
