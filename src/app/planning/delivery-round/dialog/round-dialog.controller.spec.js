'use strict'

/* global describe inject expect jasmine spyOn it beforeEach module */

describe('round-dialog.controller', function () {
  var $scope
  var nrdCtrl
  var modalInstance
  var deliveryRound
  var stateAdminLevels
  var planningService
  var noDeliveryRound
  var event

  beforeEach(module('planning'))

  beforeEach(inject(function ($rootScope, $controller, _planningService_) {
    $scope = $rootScope.$new()
    deliveryRound = {
      state: 'KANO',
      stateCode: '',
      roundNo: '',
      status: 'PLANNING',
      startDate: new Date(),
      endDate: new Date()
    }
    stateAdminLevels = []
    planningService = _planningService_
    modalInstance = {
      close: jasmine.createSpy('modalInstance.close'),
      dismiss: jasmine.createSpy('modalInstance.dismiss'),
      result: {
        then: jasmine.createSpy('modalInstance.result.then')
      }
    }
    event = {
      preventDefault: function () {
        return
      },
      stopPropagation: function () {
        return
      }
    }
    spyOn(planningService, ['getRoundCode']).and.callThrough()
    spyOn(planningService, 'saveRound').and.callThrough()
    spyOn(planningService, 'createRound').and.callThrough()
    noDeliveryRound = function () {
      deliveryRound = undefined
    }
    nrdCtrl = $controller('RoundDialogCtrl', {
      $scope: $scope,
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
    noDeliveryRound()
    expect(nrdCtrl.deliveryRound).toEqual(jasmine.any(Object))
  })

  it('should have deliveryRound object', function () {
    expect(nrdCtrl.deliveryRound).toEqual(jasmine.any(Object))
  })

  it('should have states Array', function () {
    expect(nrdCtrl.states).toEqual(jasmine.any(Array))
  })
  it('should have start object', function () {
    expect(nrdCtrl.start).toEqual(jasmine.any(Object))
    expect(nrdCtrl.start.name).toBeTruthy()
    expect(nrdCtrl.start.opened).toBeFalsy()
    expect(nrdCtrl.start.open).toEqual(jasmine.any(Function))
    nrdCtrl.start.open(event)
    expect(nrdCtrl.start.opened).toBeTruthy()
  })

  it('should have end object', function () {
    expect(nrdCtrl.end).toEqual(jasmine.any(Object))
    expect(nrdCtrl.end.name).toBeTruthy()
    expect(nrdCtrl.end.opened).toBeFalsy()
    expect(nrdCtrl.end.open).toEqual(jasmine.any(Function))
    nrdCtrl.end.open(event)
    expect(nrdCtrl.end.opened).toBeTruthy()
  })

  it('should have a setStateCode function', function () {
    expect(nrdCtrl.setStateCode).toEqual(jasmine.any(Function))
    nrdCtrl.states = [{
      _id: 'KN',
      name: 'KANO',
      roundNo: '01'
    }]
    nrdCtrl.setStateCode()
    expect(nrdCtrl.deliveryRound.stateCode).toEqual(nrdCtrl.states[0]._id)
  })

  it('should have a setRoundNumber function', function () {
    expect(nrdCtrl.setRoundNumber).toEqual(jasmine.any(Function))
    nrdCtrl.deliveryRound._id = 'KN-01-2016'
    nrdCtrl.setRoundNumber()
    expect(nrdCtrl.deliveryRound.roundNo).toBe('01')
  })

  it('should have a getRoundCode function', function () {
    expect(nrdCtrl.getRoundCode).toEqual(jasmine.any(Function))
  })

  it('should call planningService.getRoundCode on getRoundCode function', function () {
    var roundId = 'KN-01-2016'
    expect(planningService.getRoundCode).not.toHaveBeenCalled()
    nrdCtrl.getRoundCode(roundId)
    expect(planningService.getRoundCode).toHaveBeenCalledWith(jasmine.any(Object))
  })

  it('should have a continue function', function () {
    expect(nrdCtrl.continue).toEqual(jasmine.any(Function))
    expect(planningService.saveRound).not.toHaveBeenCalled()
    nrdCtrl.edit = true
    nrdCtrl.continue()
    expect(planningService.saveRound).toHaveBeenCalledWith(nrdCtrl.deliveryRound)

    expect(planningService.createRound).not.toHaveBeenCalled()
    nrdCtrl.edit = false
    nrdCtrl.continue()
    expect(planningService.createRound).toHaveBeenCalledWith(nrdCtrl.deliveryRound)
  })

  it('should have a saveAndExit function', function () {
    expect(nrdCtrl.saveAndExit).toEqual(jasmine.any(Function))
    expect(planningService.saveRound).not.toHaveBeenCalled()
    nrdCtrl.edit = true
    nrdCtrl.saveAndExit()
    expect(planningService.saveRound).toHaveBeenCalledWith(nrdCtrl.deliveryRound)

    expect(planningService.createRound).not.toHaveBeenCalled()
    nrdCtrl.edit = false
    nrdCtrl.saveAndExit()
    expect(planningService.createRound).toHaveBeenCalledWith(nrdCtrl.deliveryRound)
  })

  it('should have a cancel function', function () {
    expect(nrdCtrl.cancel).toEqual(jasmine.any(Function))
  })
})
