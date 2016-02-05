'use strict'
/* global describe, beforeEach, it, inject, expect, module, jasmine */

describe('DeliveryRoundCtrl.completePlanning', function () {
  beforeEach(module('planning', 'dbServiceMock', 'mailerServiceMock', 'authServiceMock'))

  var deliveryRounds
  var drCtrl
  var scope
  var $rootScope
  var modal

  beforeEach(inject(function (_$controller_, _$rootScope_) {
    deliveryRounds = []
    $rootScope = _$rootScope_
    scope = $rootScope.$new()
    modal = {
      open: function (obj) {
        return obj
      }
    }
    drCtrl = _$controller_('DeliveryRoundCtrl', {
      deliveryRounds: deliveryRounds,
      $scope: scope,
      $rootScope: $rootScope,
      $modal: modal
    })
  }))

  it('should expose completePlanning function', function () {
    var deliveryRound = {
      id: 'KN-01-2016',
      _id: 'KN-01-2016',
      state: 'Kano',
      status: 'Planning'
    }
    drCtrl.completePlanning(deliveryRound)
    $rootScope.$digest()
  })

  it('should expose open function', function () {
    drCtrl.open()
  })
  it('should have array deliveryRounds on stateChange event', function () {
    $rootScope.$broadcast('stateChanged')
    expect(drCtrl.deliveryRounds).toEqual(jasmine.any(Array))
    $rootScope.$digest()
  })
})
