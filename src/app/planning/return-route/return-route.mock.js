'use strict'

angular.module('returnRouteMock', [])
  .constant('deliveryReturnRoutesMock', [
    {
      '_id': 'rr-1',
      'deliveryRoundID': 'KN-21-2015',
      'driverID': 'abdullahi@example.com',
      'deliveryDate': '2015-05-21',
      'store': {
        '_id': 'NASSARAWA-ZONAL-STORE',
        'name': 'Nassarawa Zonal Store'
      },
      'estimatedDistance': 90,
      'actualDistance': 85,
      'doc_type': 'return-route'
    },
    {
      '_id': 'rr-2',
      'deliveryRoundID': 'KN-21-2015',
      'driverID': 'abdullahi@example.com',
      'deliveryDate': '2015-05-08',
      'store': {
        '_id': 'NASSARAWA-ZONAL-STORE',
        'name': 'Nassarawa Zonal Store'
      },
      'estimatedDistance': 115,
      'actualDistance': 120,
      'doc_type': 'return-route'
    },
    {
      '_id': 'rr-3',
      'deliveryRoundID': 'KN-21-2015',
      'driverID': 'bashir@example.com',
      'deliveryDate': '2015-05-21',
      'store': {
        '_id': 'NASSARAWA-ZONAL-STORE',
        'name': 'Nassarawa Zonal Store'
      },
      'estimatedDistance': 120,
      'actualDistance': 150,
      'doc_type': 'return-route'
    }
  ])
  .constant('packingStoresMock', [
    {
      _id: 'STATE-STORE',
      name: 'Kano State Store',
      state: 'Kano'
    },
    {
      _id: 'NASSARAWA-ZONAL-STORE',
      name: 'Nassarawa Zonal Store',
      state: 'Kano'
    },
    {
      _id: 'RANO-ZONAL-STORE',
      name: 'Rano Zonal Store',
      state: 'Kano'
    },
    {
      _id: 'WUDIL-ZONAL-STORE',
      name: 'Wudil Zonal Store',
      state: 'Kano'
    }
  ])
