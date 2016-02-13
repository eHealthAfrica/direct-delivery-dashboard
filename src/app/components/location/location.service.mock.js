'use strict'

angular.module('locationServiceMock', [])
  .factory('locationLevels', function () {
    return [
      {
        '_id': '0',
        '_rev': '1-e24dba77d54ed4180a69b6d1ae08e35c',
        'doc_type': 'location-level',
        'name': 'Country',
        'level': 0,
        'parent': null
      },
      {
        '_id': '2',
        '_rev': '1-19f775ca010ff31863ab7e5c5287b131',
        'doc_type': 'location-level',
        'name': 'State',
        'level': 2,
        'parent': '1'
      },
      {
        '_id': '4',
        '_rev': '1-e0c680ed5a7a4b0a38c48ab256590cce',
        'doc_type': 'location-level',
        'name': 'LGA',
        'level': 4,
        'parent': '3'
      },
      {
        '_id': '6',
        '_rev': '1-b0f5cef2026b3c7d7f86dce008628bd3',
        'doc_type': 'location-level',
        'name': 'Facility',
        'level': 6,
        'parent': '5'
      }
    ]
  })
  .factory('locations', function () {
    return [
      {
        '_id': 'NG',
        '_rev': '1-7960ebca733ed7d5c51afd6ee6a69bd5',
        'doc_type': 'location',
        'level': '0',
        'name': 'Nigeria',
        'ancestors': [
        ]
      },
      {
        '_id': 'NW',
        '_rev': '1-b6875281aaf0c085e38b6fc8e871af00',
        'doc_type': 'location',
        'level': '1',
        'name': 'North West',
        'ancestors': [
          'NG'
        ]
      },
      {
        '_id': 'BA',
        '_rev': '1-710ebc40f0e7913b0b4f591887c2b543',
        'name': 'Bauchi',
        'osmId': '3722233',
        'ISO3166-2': 'NG-BA',
        'ancestors': [
          null,
          null
        ],
        'doc_type': 'location',
        'level': '2'
      },
      {
        '_id': 'KN',
        '_rev': '2-53d11b28c6ae15c2fc8a4b7ef14ac12b',
        'name': 'Kano',
        'osmId': '3710302',
        'ISO3166-2': 'NG-KN',
        'ancestors': [
          'NG',
          'NW'
        ],
        'doc_type': 'location',
        'level': '2'
      },
      {
        '_id': 'NG-NW-KN-BICHI',
        '_rev': '1-459ec4308a4fb56aadbaa727371e10d4',
        'name': 'Bichi',
        'osmId': '',
        'ancestors': [
          'NG',
          'NW',
          'KN'
        ],
        'doc_type': 'location',
        'level': '3'
      },
      {
        '_id': 'NG-NW-KN-BICHI-KN-BAGWAI',
        '_rev': '1-46d3d664af864475d44521f2bba4884b',
        'name': 'Bagwai',
        'osmId': '3710305',
        'ISO3166-2': '',
        'ancestors': [
          'NG',
          'NW',
          'KN',
          'BICHI-KN'
        ],
        'doc_type': 'location',
        'level': '4'
      },
      {
        '_id': 'NG-NW-KN-BICHI-BAGWAI-BAGWAI',
        '_rev': '1-57dc8494fb4c80ae5947ea2e3d921e81',
        'name': 'Bagwai',
        'osmId': '3710366',
        'ISO3166-2': '',
        'doc_type': 'location',
        'level': '5',
        'ancestors': [
          'NG',
          'NW',
          'KN',
          'BICHI-KN',
          'NG-NW-KN-BICHI-KN-BAGWAI'
        ]
      },
      {
        '_id': 'NG-NW-KN-BICHI-BAGWAI-BAGWAI-ABBAS_PRIMARY_HEALTH_CENTER',
        '_rev': '1-793deeb725c73cf8b505445b41625f0c',
        'ancestors': [
          'NG',
          'NW',
          'KN',
          'NG-NW-KN-BICHI',
          'NG-NW-KN-BICHI-KN-BAGWAI',
          'NG-NW-KN-BICHI-BAGWAI-BAGWAI'
        ],
        'osmId': '64574',
        'ownership': 'Public',
        'latitude': '12.153278',
        'longitude': '8.137021',
        'category': 'Primary Health Center',
        'name': 'Abbas Primary Health Center',
        'level': '6',
        'first_contact_name': '',
        'first_contact_phone': '',
        'first_contact_email': '',
        'second_contact_name': '',
        'second_contact_phone': '',
        'second_contact_email': '',
        'doc_type': 'location'
      }
    ]
  })
  .factory('locationService', function (locations, $q) {
    return {
      getLocationsByLevel: function (level) {
        var deferred = $q.defer()
        deferred.resolve([locations[level]])
        return deferred.promise
      },
      getByLevelAndAncestor: function () {
        return $q.when(locations)
      },
      getByIds: function () {
        return $q.when(locations)
      }
    }
  })
