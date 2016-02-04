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
        howMuchLate: 'UNKNOWN'
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
        howMuchLate: 'UNKNOWN'
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
        lag: 1
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
        }
      }
    })
}(angular))
