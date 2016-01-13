'use strict'
/* global describe, beforeEach, it, inject, expect, module, spyOn, jasmine */

describe('DeliveryRoundCtrl.completePlanning', function () {
  beforeEach(module('planning'))

  var planningService
  var deliveryRoundService
  var deliveryRounds
  var DeliveryRoundCtrl
  var scope = {
    $on: function () {
      return {}
    }
  }

  beforeEach(function () {
    deliveryRounds = []

    module(function ($provide) {
      $provide.value('deliveryRounds', deliveryRounds)
    })
  })
  beforeEach(inject(function (
    _$controller_,
    _planningService_,
    _deliveryRoundService_
  ) {
    planningService = _planningService_
    deliveryRoundService = _deliveryRoundService_

    DeliveryRoundCtrl = _$controller_('DeliveryRoundCtrl', {
      planningService: _planningService_,
      deliveryRoundService: _deliveryRoundService_,
      deliveryRounds: deliveryRounds,
      $scope: scope
    })

    spyOn(planningService, 'completePlanning').and.callThrough()
    spyOn(deliveryRoundService, 'getStateAdminLevels').and.callFake(function () {
      return []
    })
  }))
  it('Should call planningService.completePlanning with expected parameter', function () {
    expect(planningService.completePlanning).not.toHaveBeenCalled()
    DeliveryRoundCtrl.completePlanning(jasmine.any(Object))
    expect(planningService.completePlanning).toHaveBeenCalledWith(jasmine.any(Object))
  })
})
