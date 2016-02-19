'use strict'

/* global describe inject expect jasmine  it beforeEach module */

describe('round-dialog.controller', function () {
  var scope
  var nrdCtrl
  var $rootScope
  var modalInstance
  var deliveryRound
  var stateAdminLevels
  var stateMock

  beforeEach(module('planning', 'dbServiceMock', 'mailerServiceMock'))

  beforeEach(inject(function (_$rootScope_, $controller, $q) {
    $rootScope = _$rootScope_
    scope = $rootScope.$new()
    modalInstance = {
      close: function () {},
      dismiss: function () {}
    }
    deliveryRound = {
      id: 'KN-01-2016',
      _id: 'KN-01-2016',
      state: 'Kano'
    }
    stateAdminLevels = [
      {
        '_id': 'BA',
        '_rev': '1-10ab65143f2e9881e578eff5a1b1eafa',
        'doc_type': 'location',
        'level': '2',
        'name': 'Bauchi',
        'ancestors': [
          'NG',
          'NE'
        ]
      },
      {
        '_id': 'KN',
        '_rev': '1-ddd3c940d3768dee75fe0763e722ec3a',
        'doc_type': 'location',
        'level': '2',
        'name': 'Kano',
        'ancestors': [
          'NG',
          'NW'
        ]
      }
    ]
    stateMock = {
      go: function () {
        return $q.when({})
      }
    }

    nrdCtrl = $controller('RoundDialogCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      deliveryRound: deliveryRound,
      stateAdminLevels: stateAdminLevels,
      $state: stateMock,
      selectedStateName: 'Kano'
    })
  }))
  it('should have a deliveryRound object', function () {
    expect(nrdCtrl.deliveryRound).toEqual(jasmine.any(Object))
  })
  it('should expose start object with a open function', function () {
    expect(nrdCtrl.start).toEqual(jasmine.any(Object))
    expect(nrdCtrl.start.open).toEqual(jasmine.any(Function))
  })
  it('should set nrdCtrl.end.opened to false', function () {
    var $event = scope.$emit('click')
    nrdCtrl.start.open($event)
    expect(nrdCtrl.end.opened).toBeFalsy()
  })

  it('should expose end object with a open function', function () {
    expect(nrdCtrl.end).toEqual(jasmine.any(Object))
    expect(nrdCtrl.end.open).toEqual(jasmine.any(Function))
  })
  it('should set nrdCtrl.start.opened to false', function () {
    var $event = scope.$emit('click')
    nrdCtrl.end.open($event)
    expect(nrdCtrl.start.opened).toBeFalsy()
  })

  it('should expose setStateCode function', function () {
    nrdCtrl.setStateCode()
    $rootScope.$digest()
    expect(nrdCtrl.deliveryRound.stateCode).toBeDefined()
  })

  it('should expose a setRoundNumber function', function () {
    nrdCtrl.setRoundNumber()
    $rootScope.$digest()
    expect(nrdCtrl.deliveryRound.roundNo).toBeDefined()
  })

  it('should expose continue function', function () {
    nrdCtrl.continue()
    $rootScope.$digest()
  })

  it('should call createAndContinue if scope.edit if null', function () {
    nrdCtrl.edit = null
    nrdCtrl.continue()
    $rootScope.$digest()
  })

  it('should expose saveAndExit function', function () {
    nrdCtrl.saveAndExit()
    $rootScope.$digest()
  })

  it('should call createAndExit if scope.edit if null', function () {
    nrdCtrl.edit = null
    nrdCtrl.saveAndExit()
    $rootScope.$digest()
  })

  it('should expose cancel function', function () {
    nrdCtrl.cancel()
  })
})
