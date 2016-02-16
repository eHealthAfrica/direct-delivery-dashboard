'use strict'

angular.module('allocationsMock', [])
  .factory('assumptions', function () {
    return [
      {
        '_id': 'KN-2015',
        '_rev': '7-cf12f7935f6fff533abfb356b2bf23ae',
        'description': '',
        'primary': {
          'state': 'KN',
          'year': '2015'
        },
        'products': {
          'ADS-0.05ml': {
            'presentation': 0,
            'coverage': 0,
            'schedule': 0,
            'wastage': 0,
            'buffer': 0
          },
          'BCG': {
            'presentation': 20,
            'coverage': 83,
            'schedule': 1,
            'wastage': 2,
            'buffer': 25
          },
          'DT': {
            'presentation': 0,
            'coverage': 0,
            'schedule': 0,
            'wastage': 0,
            'buffer': 0
          },
          'HepA': {
            'presentation': 0,
            'coverage': 0,
            'schedule': 0,
            'wastage': 0,
            'buffer': 0
          },
          'HepB': {
            'presentation': 0,
            'coverage': 0,
            'schedule': 0,
            'wastage': 0,
            'buffer': 0
          },
          'HPV': {
            'presentation': 10,
            'coverage': 83,
            'schedule': 1,
            'wastage': 1.33,
            'buffer': 25
          },
          'Measles': {
            'presentation': 10,
            'coverage': 83,
            'schedule': 1,
            'wastage': 1.43,
            'buffer': 25
          },
          'Men-A': {
            'presentation': 10,
            'coverage': 83,
            'schedule': 1,
            'wastage': 1.43,
            'buffer': 25
          },
          'OPV': {
            'presentation': 20,
            'coverage': 83,
            'schedule': 4,
            'wastage': 1.33,
            'buffer': 25
          },
          'Penta': {
            'presentation': 10,
            'coverage': 83,
            'schedule': 3,
            'wastage': 1.33,
            'buffer': 25
          },
          'SB-2.5L': {
            'presentation': 0,
            'coverage': 0,
            'schedule': 0,
            'wastage': 0,
            'buffer': 0
          },
          'Syr-Dil-2ml': {
            'presentation': 0,
            'coverage': 0,
            'schedule': 0,
            'wastage': 1.1,
            'buffer': 0
          },
          'TT': {
            'presentation': 10,
            'coverage': 83,
            'schedule': 2,
            'wastage': 1.33,
            'buffer': 25
          },
          'YF': {
            'presentation': 10,
            'coverage': 83,
            'schedule': 1,
            'wastage': 1.43,
            'buffer': '20'
          },
          '0.005ml': {
            '_id': '0.005ml',
            '_rev': '2-cdb2694ad8f3b6d5dc0d7c45a3028006',
            'doc_type': 'product',
            'name': '0.005ml',
            'code': '0.005ml',
            'description': '1',
            'baseUOM': 'Units',
            'storageID': 'product-storage/dry',
            'createdOn': '2015-11-06T15:34:55.639Z',
            'modifiedOn': '2015-12-04T09:21:29.056Z',
            'coverage': '83'
          },
          '0.05ml': {
            '_id': '0.05ml',
            '_rev': '2-261abc30a7b7c9b7545f4cbfdd1a07c7',
            'doc_type': 'product',
            'name': '0.05ml',
            'code': '0.05ml',
            'baseUOM': 'Units',
            'storageID': 'product-storage/dry',
            'createdOn': '2015-10-30T10:10:49.277Z',
            'modifiedOn': '2015-12-04T09:22:27.025Z',
            'description': 'syringe',
            'coverage': '82'
          }
        },
        'doc_type': 'assumptions',
        'createdOn': '2015-11-05T12:06:49.337Z',
        'modifiedOn': '2016-01-21T16:45:57.171Z',
        'name': 'KN-2015'
      }
    ]
  })
