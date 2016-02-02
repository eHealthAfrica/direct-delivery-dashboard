'use strict'

/* global describe inject expect jasmine spyOn it beforeEach module */

describe('round-dialog.controller', function () {
  var scope
  var nrdCtrl
  var modalInstance
  var deliveryRound
  var stateAdminLevels
  var planningService
  beforeEach(module('planning'))

  beforeEach(inject(function ($rootScope, $controller, _planningService_) {
    scope = $rootScope.$new()
    deliveryRound = []
    stateAdminLevels = []
    planningService = _planningService_
    modalInstance = {
      close: jasmine.createSpy('modalInstance.close'),
      dismiss: jasmine.createSpy('modalInstance.dismiss'),
      result: {
        then: jasmine.createSpy('modalInstance.result.then')
      }
    }

    spyOn(planningService, 'getRoundCode').and.callThrough()

    nrdCtrl = $controller('RoundDialogCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      deliveryRound: deliveryRound,
      stateAdminLevels: stateAdminLevels,
      planningService: planningService
    })
  }))

  it('should have ROUND_STATUS object', function () {
    expect(nrdCtrl.ROUND_STATUS).toEqual(jasmine.any(Object))
  })

  it('should make a new delivery if none is supplied', function () {
    nrdCtrl.deliveryRound = deliveryRound = false
    var dRound = {
      state: '',
      stateCode: '',
      roundNo: '',
      status: nrdCtrl.ROUND_STATUS.PLANNING,
      startDate: new Date(),
      endDate: ''
    }
    function deliveryRoundSupplied (deliveryRound) {
      if (!angular.isObject(deliveryRound)) {
        nrdCtrl.deliveryRound = dRound
      } else {
        nrdCtrl.deliveryRound = deliveryRound
        nrdCtrl.edit = true
      }
    }
    deliveryRoundSupplied()
    expect(nrdCtrl.deliveryRound).toEqual(dRound)

    deliveryRoundSupplied(dRound)
    expect(nrdCtrl.deliveryRound).toEqual(dRound)
  })

  it('should have deliveryRound object', function () {
    expect(nrdCtrl.deliveryRound).toEqual(jasmine.any(Object))
  })

  it('should have start object', function () {
    expect(nrdCtrl.start).toEqual(jasmine.any(Object))
    expect(nrdCtrl.start.name).toBeTruthy()
    expect(nrdCtrl.start.opened).toBeFalsy()
    expect(nrdCtrl.start.open).toEqual(jasmine.any(Function))
  })

  it('should have end object', function () {
    expect(nrdCtrl.end).toEqual(jasmine.any(Object))
    expect(nrdCtrl.end.name).toBeTruthy()
    expect(nrdCtrl.end.opened).toBeFalsy()
    expect(nrdCtrl.end.open).toEqual(jasmine.any(Function))
  })

  it('should have a setStateCode function', function () {
    expect(nrdCtrl.setStateCode).toEqual(jasmine.any(Function))
  })

  it('should have a setRoundNumber function', function () {
    expect(nrdCtrl.setRoundNumber).toEqual(jasmine.any(Function))
  })

  it('should have a getRoundCode function', function () {
    expect(nrdCtrl.getRoundCode).toEqual(jasmine.any(Function))
  })

  it('should call planningService.getRoundCode on getRoundCode function', function () {
    var roundId = 'KN-01-2016'
    expect(planningService.getRoundCode).not.toHaveBeenCalled()
    nrdCtrl.getRoundCode(roundId)
    expect(planningService.getRoundCode).toHaveBeenCalledWith(jasmine.any(Array))
  })

  it('should have a continue function', function () {
    expect(nrdCtrl.continue).toEqual(jasmine.any(Function))
  })

  it('should have a saveAndExit function', function () {
    expect(nrdCtrl.saveAndExit).toEqual(jasmine.any(Function))
  })

  it('should have a cancel function', function () {
    expect(nrdCtrl.cancel).toEqual(jasmine.any(Function))
  })
})
