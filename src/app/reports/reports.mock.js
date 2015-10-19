'use strict'

;(function (angular) {
  var deliveryRounds = [
    {
      id: 'round1',
      key: ['State1', '2015-01-01'],
      value: {roundCode: 'RC1', endDate: '2015-01-13'}
    }
  ]

  var dailyDeliveries = [
    {
      id: 'delivery1',
      key: ['round1', 'driver1@example.com', '2015-01-01', 1],
      value: {
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

  angular.module('reportsMock', [])
    .constant('deliveryRounds', deliveryRounds)
    .constant('dailyDeliveries', dailyDeliveries)
    .factory('pouchDB', function ($q) {
      return function pouchDB () {
        return {
          query: function (view) {
            var response = null

            switch (view) {
              case 'reports/delivery-rounds':
                response = {
                  rows: deliveryRounds
                }
                break

              case 'reports/daily-deliveries':
                response = {
                  rows: dailyDeliveries
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
      }
    })
}(angular))
