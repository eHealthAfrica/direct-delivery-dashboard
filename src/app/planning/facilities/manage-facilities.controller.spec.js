'use strict'

/* global describe inject module it expect jasmine beforeEach */

describe('manage-facilities controller', function () {
  var $rootScope
  var scope
  var mfCtrl
  var deliveryRound
  var locationLevels
  var stateMock
  var facilityList = [
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

  beforeEach(module('planning', 'modalMock', 'dbServiceMock'))

  beforeEach(inject(function (_$rootScope_, _$controller_, $q) {
    $rootScope = _$rootScope_
    scope = $rootScope.$new()
    deliveryRound = {
      id: 'KN-01-2016',
      _id: 'KN-01-2016',
      state: 'Kano',
      status: 'Planning'
    }

    stateMock = {
      go: function () {
        return $q.when({})
      }
    }

    locationLevels = [
      {
        id: '0',
        key: '0',
        value: {
          _id: '0',
          name: 'Country',
          level: 0
        }
      },
      {
        id: '1',
        key: '1',
        value: {
          _id: '1',
          name: 'National Zone',
          level: 1
        }
      },
      {
        id: '2',
        key: '2',
        value: {
          _id: '2',
          name: 'State',
          level: 2
        }
      },
      {
        id: '3',
        key: '3',
        value: {
          _id: '3',
          name: 'State Zone',
          level: 3
        }
      },
      {
        id: '4',
        key: '4',
        value: {
          _id: '4',
          name: 'LGA',
          level: 4
        }
      }
    ]

    mfCtrl = _$controller_('ManageFacilitiesCtrl', {
      $rootScope: $rootScope,
      $scope: scope,
      deliveryRound: deliveryRound,
      locationLevels: locationLevels,
      $state: stateMock
    })
  }))

  it('shoould expose a openAddFacilitiesDialog function', function () {
    mfCtrl.openAddFacilitiesDialog()
    $rootScope.$digest()
    expect(mfCtrl.facilityList).toEqual(jasmine.any(Array))
    expect(mfCtrl.selectedList).toEqual(jasmine.any(Object))
  })

  it('shoould expose a copyFromRoundDialog function', function () {
    mfCtrl.copyFromRoundDialog()
    $rootScope.$digest()
  })

  it('shoould expose a onSelect function', function () {
    mfCtrl.onSelect('None')
    $rootScope.$digest()
  })

  it('shoould expose a onSelect function supplied with param all', function () {
    mfCtrl.facilityList = facilityList
    mfCtrl.onSelect('All')
    $rootScope.$digest()
  })

  it('should expose save a function', function () {
    mfCtrl.save()
    $rootScope.$digest()
  })

  it('should expose a disableSave function', function () {
    mfCtrl.disableSave()
  })
})
