'use strict'

var deliveries = [
  {
    _id: '1b03d0925529656b4c83caed461da1b4',
    _rev: '5-d05910f3ac8d941513e280cf90f8a5f6',
    doc_type: 'dailyDelivery',
    deliveryRoundID: 'KN-01-2015',
    date: '2015-12-08',
    window: '9AM-11AM',
    drop: '1',
    signature: { },
    cancelReport: { },
    facility: {
      name: 'Babawa Model Primary Health Care',
      id: 'KNS-GZW-BBW-101',
      ward: 'Babawa',
      lga: 'Gezawa',
      zone: 'Nassarawa'
    },
    distance: '34',
    targetDate: '2015-12-08T00:00:00.000Z',
    driverID: 'bashir@example.com',
    createdOn: '2015-12-08T09:12:56.444Z',
    modifiedOn: '2015-12-08T09:14:28.063Z',
    packedProduct: [
      {
        productID: '10',
        expectedQty: 3
      },
      {
        productID: '0.05ml',
        expectedQty: 4
      },
      {
        productID: '002',
        expectedQty: 3
      }
    ]
  },
  {
    _id: '1b03d0925529656b4c83caed461daf1e',
    _rev: '5-3c4161d3c720f17aba68c8682c4152b4',
    doc_type: 'dailyDelivery',
    deliveryRoundID: 'KN-01-2015',
    date: '2015-12-31',
    window: '9AM-11AM',
    drop: 2,
    signature: { },
    cancelReport: { },
    status: 'Upcoming: 1st Attempt',
    facility: {
      name: 'Babawa Model Primary Health Care',
      id: 'NG-NW-KN-NASSARAWA-GEZAWA-BABAWA-BABAWA_MODEL_PRIMARY_HEALTH_CARE',
      ward: 'Babawa',
      lga: 'Gezawa',
      zone: 'Nassarawa'
    },
    balance: [],
    packingList: [
      {
        productID: '10',
        expectedQty: 7
      },
      {
        productID: '0.05ml',
        expectedQty: 6
      },
      {
        productID: '002',
        expectedQty: 3
      }
    ],
    packedProduct: [
      {
        productID: '10',
        expectedQty: 7
      },
      {
        productID: '0.05ml',
        expectedQty: 6
      },
      {
        productID: '002',
        expectedQty: 3
      }
    ],
    createdOn: '2015-12-08T09:14:36.370Z',
    modifiedOn: '2015-12-31T15:45:03.725Z',
    distance: '23',
    targetDate: '',
    driverID: 'bashir@example.com'
  },
  {
    _id: '1b03d0925529656b4c83caed461db97d',
    _rev: '4-6d8e0f2a730956f9bd46e6ae33028dea',
    doc_type: 'dailyDelivery',
    deliveryRoundID: 'KN-01-2015',
    date: '',
    window: '',
    drop: '',
    signature: { },
    cancelReport: { },
    status: 'Upcoming: 1st Attempt',
    facility: {
      name: 'Gunduwawa Health Post',
      id: 'NG-NW-KN-NASSARAWA-GEZAWA-BABAWA-GUNDUWAWA_HEALTH_POST',
      ward: 'Babawa',
      lga: 'Gezawa',
      zone: 'Nassarawa'
    },
    packedProduct: [
      {
        productID: '10',
        expectedQty: 4
      },
      {
        productID: '0.05ml',
        expectedQty: 9
      },
      {
        productID: '002',
        expectedQty: 6
      }
    ],
    createdOn: '2015-12-08T09:14:45.062Z',
    modifiedOn: '2015-12-08T09:14:45.062Z'
  },
  {
    _id: '1b03d0925529656b4c83caed461da1b4',
    _rev: '5-d05910f3ac8d941513e280cf90f8a5f6',
    doc_type: 'dailyDelivery',
    deliveryRoundID: 'KN-01-2015',
    date: '2015-12-08',
    drop: '1',
    signature: { },
    cancelReport: { },
    facilityRounds: [
      {
        facility: {
          name: 'Babawa Model Primary Health Care',
          id: 'KNS-GZW-BBW-101',
          ward: 'Babawa',
          lga: 'Gezawa',
          zone: 'Nassarawa'
        },
        distance: '34',
        targetDate: '2015-12-08T00:00:00.000Z',
        driverID: 'bashir@example.com',
        window: '9AM-11AM',
        packedProduct: [
          {
            productID: '10',
            expectedQty: 3
          },
          {
            productID: '0.05ml',
            expectedQty: 4
          },
          {
            productID: '002',
            expectedQty: 3
          }
        ]
      }
    ],
    createdOn: '2015-12-08T09:12:56.444Z',
    modifiedOn: '2015-12-08T09:14:28.063Z',
    packedProduct: [
      {
        productID: '10',
        expectedQty: 3
      },
      {
        productID: '0.05ml',
        expectedQty: 4
      },
      {
        productID: '002',
        expectedQty: 3
      }
    ]
  }
]

angular.module('dailyDeliveryMock', [])
  .factory('deliveryService', function ($q) {
    return {
      getByRoundId: function (param) {
        var deferred = $q.defer()
        if (param === 'fail') {
          deferred.reject('reason')
        } else {
          deferred.resolve(deliveries)
        }
        return deferred.promise
      }
    }
  })
  .factory('dailyDeliveries', function () {
    return deliveries
  })
