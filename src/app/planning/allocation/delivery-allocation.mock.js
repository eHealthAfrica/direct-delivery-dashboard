'use strict'

angular.module('deliveryAllocationMock', [])
  .constant('facilityAllocationInfoMock', {
    rows: [{
      '_id': '18d13ea4fb9088959921e8794eadb5ed',
      'facility': {
        'zone': 'Wudil',
        'lga': 'Test LGA',
        'ward': 'Test Ward',
        'name': 'Test Health Post',
        'id': 'KNS Test 101',
        'contact': 'Test Person',
        'phoneNo': 80123456789
      },
      'packedProduct': {
        'BCG': {
          'productID': 'BCG',
          'expectedQty': 120,
          'baseUOM': 'Doses',
          'presentation': 20,
          'storageID': 'product-storage/frozen'
        },
        'MV': {
          'productID': 'MV',
          'expectedQty': 60,
          'baseUOM': 'Doses',
          'presentation': 10,
          'storageID': 'product-storage/frozen'
        },
        'YF': {
          'productID': 'YF',
          'expectedQty': 60,
          'baseUOM': 'Doses',
          'presentation': 10,
          'storageID': 'product-storage/frozen'
        },
        'OPV': {
          'productID': 'OPV',
          'expectedQty': 240,
          'baseUOM': 'Doses',
          'presentation': 10,
          'storageID': 'product-storage/frozen'
        },
        'IPV': {
          'productID': 'IPV',
          'expectedQty': 60,
          'baseUOM': 'Doses',
          'presentation': 10,
          'storageID': 'product-storage/refrigerator'
        },
        'TT': {
          'productID': 'TT',
          'expectedQty': 300,
          'baseUOM': 'Doses',
          'presentation': 10,
          'storageID': 'product-storage/refrigerator'
        },
        'Penta': {
          'productID': 'Penta',
          'expectedQty': 180,
          'baseUOM': 'Doses',
          'presentation': 10,
          'storageID': 'product-storage/refrigerator'
        },
        'HBV': {
          'productID': 'HBV',
          'expectedQty': 60,
          'baseUOM': 'Doses',
          'presentation': 10,
          'storageID': 'product-storage/refrigerator'
        },
        'YF Dil': {
          'productID': 'YF Dil',
          'expectedQty': 6,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/refrigerator'
        },
        'MV Dil': {
          'productID': 'MV Dil',
          'expectedQty': 6,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/refrigerator'
        },
        'BCG Dil': {
          'productID': 'BCG Dil',
          'expectedQty': 6,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/refrigerator'
        },
        '0.05ml': {
          'productID': '0.05ml',
          'expectedQty': 132,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/dry'
        },
        '0.5ml': {
          'productID': '0.5ml',
          'expectedQty': 792,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/dry'
        },
        'RC 2ml': {
          'productID': 'RC 2ml',
          'expectedQty': 7,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/dry'
        },
        'RC 5ml': {
          'productID': 'RC 5ml',
          'expectedQty': 14,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/dry'
        },
        'Safety Boxes': {
          'productID': 'Safety Boxes',
          'expectedQty': 11,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/dry'
        },
        'Droppers': {
          'productID': 'Droppers',
          'expectedQty': 12,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/dry'
        },
        'Cards': {
          'productID': 'Cards',
          'expectedQty': 120,
          'baseUOM': 'Units',
          'presentation': 1,
          'storageID': 'product-storage/dry'
        }
      }
    }],
    lgaList: ['Test LGA'],
    productList: ['BCG', 'MV', 'YF', 'OPV', 'IPV', 'TT', 'Penta', 'HBV', 'YF Dil', 'MV Dil', 'BCG Dil', '0.05ml', '0.5ml', 'RC 2ml', 'RC 5ml', 'Safety Boxes', 'Droppers', 'Cards']
  })
  .constant('allocationTemplatesMock', [{
    '_id': 'KN-2015-1',
    '_rev': '1-4bbd5453f21c9d9c635ec89c8baf277c',
    'description': 'Allocation template for Kano state, 2015',
    'createdOn': '2015-08-13T11:02:28.723Z',
    'modifiedOn': '2015-09-03T11:04:10.761Z',
    'doc_type': 'allocation_template',
    'name': 'KN-2015-1',
    'products': {
      'ADS-0.05ml': {
        'presentation': 0,
        'coverage': '83',
        'schedule': 0,
        'wastage': 0,
        'buffer': '25'
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
        'coverage': '83',
        'schedule': 0,
        'wastage': 0,
        'buffer': '25'
      },
      'HepA': {
        'presentation': 0,
        'coverage': '83',
        'schedule': 0,
        'wastage': 0,
        'buffer': '25'
      },
      'HepB': {
        'presentation': 0,
        'coverage': '83',
        'schedule': 0,
        'wastage': 0,
        'buffer': '25'
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
        'coverage': '83',
        'schedule': 0,
        'wastage': 0,
        'buffer': '25'
      },
      'Syr-Dil-2ml': {
        'presentation': 0,
        'coverage': '83',
        'schedule': 0,
        'wastage': 1.1,
        'buffer': '25'
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
        'buffer': 25
      }
    },
    'primary': {'state': 'KN', 'year': '2015'}
  }])
