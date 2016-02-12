'use strict'

angular.module('modalMock', [])
  .factory('$modal', function ($q) {
    var facilities = [
      {
        '_id': 'NG-NW-KN-NASSARAWA-GEZAWA-BABAWA-BABAWA_MODEL_PRIMARY_HEALTH_CARE',
        '_rev': '1-6ee0af5fd02c8b8a5d9c3ab9774a5f61',
        'ancestors': [
          'NG',
          'NW',
          'KN',
          'NASSARAWA-KN',
          'GEZAWA-NASSARAWA-KN',
          'BABAWA-GEZAWA-NASSARAWA-KN'
        ],
        'osmId': '61894',
        'ownership': 'Public',
        'latitude': '12.057998514',
        'longitude': '8.66027597',
        'category': 'Primary Health Center',
        'name': 'Babawa Model Primary Health Care',
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
    return {
      open: function (obj) {
        var responseData = []
        if (obj.controller === 'AddFacilityDialogCtrl') {
          responseData = facilities
        }
        return {
          result: {
            then: function (callback) {
              return $q.when(callback(responseData))
            }
          }
        }
      }
    }
  })
  .factory('$modalInstance', function () {
    return {
      close: function () {},
      dismiss: function () {}
    }
  })
