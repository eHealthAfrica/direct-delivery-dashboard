'use strict'

angular.module('deliveryRoundMock', [])
  .factory('deliveryRounds', function () {
    return [
      {
        '_id': 'KN-007-2015',
        '_rev': '2-87ba57ab6d585fbe30185fee37f61cb8',
        'state': 'Kano',
        'stateCode': 'KN',
        'roundNo': '007',
        'status': 'Planning',
        'startDate': '2015-10-20',
        'endDate': '2015-10-31',
        'roundCode': 'KN-007-2015',
        'doc_type': 'deliveryRound',
        'createdOn': '2015-10-20T11:15:49.418Z',
        'modifiedOn': '2015-10-20T11:15:49.418Z'
      }
    ]
  })
  .factory('deliveryRound', function () {
    return {
      '_id': 'KN-007-2015',
      '_rev': '2-87ba57ab6d585fbe30185fee37f61cb8',
      'state': 'Kano',
      'stateCode': 'KN',
      'roundNo': '007',
      'status': 'Planning',
      'startDate': '2015-10-20',
      'endDate': '2015-10-31',
      'roundCode': 'KN-007-2015',
      'doc_type': 'deliveryRound',
      'createdOn': '2015-10-20T11:15:49.418Z',
      'modifiedOn': '2015-10-20T11:15:49.418Z'
    }
  })
