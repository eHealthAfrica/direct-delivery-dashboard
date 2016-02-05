'use strict'
/* global describe, beforeEach, it, inject, expect, module */

describe('DeliveryReportCtrl', function () {
  beforeEach(module('reports', 'config', 'dbServiceMock', 'authServiceMock'))

  var DeliveryReportCtrl
  var rootScope
  var scope = {
    selectedState: {
      _id: 'STATEID',
      name: 'State1'
    },
    $on: function () {
      return {}
    }
  }
  var event = {
    preventDefault: function () {},
    stopPropagation: function () {}
  }
  beforeEach(inject(function ($controller, _$rootScope_) {
    rootScope = _$rootScope_
    DeliveryReportCtrl = $controller('DeliveryReportCtrl', {
      $scope: scope
    })
  }))

  it('should be defined', function () {
    expect(DeliveryReportCtrl).toBeDefined()
  })

  it('Should expose startFrom as date object', function () {
    var isDate = angular.isDate(DeliveryReportCtrl.startFrom)
    expect(isDate).toBeTruthy()
  })

  it('Should expose stopOn as date object', function () {
    var isDate = angular.isDate(DeliveryReportCtrl.stopOn)
    expect(isDate).toBeTruthy()
  })

  describe('DeliveryReportCtrl.start', function () {
    it('Should have "start.opened" property', function () {
      expect(DeliveryReportCtrl.start.opened).toBeDefined()
    })

    it('Should expose "start.open" as a function', function () {
      var isAFunction = angular.isFunction(DeliveryReportCtrl.start.open)
      expect(isAFunction).toBeTruthy()
    })
  })

  describe('DeliveryReportCtrl.stop', function () {
    it('Should have "stop.opened" property', function () {
      expect(DeliveryReportCtrl.stop.opened).toBeDefined()
    })

    it('Should expose "stop.open" as a function', function () {
      var isAFunction = angular.isFunction(DeliveryReportCtrl.stop.open)
      expect(isAFunction).toBeTruthy()
    })

    it('should toggle the state of "stop.opened" if stop.open is called', function () {
      DeliveryReportCtrl.stop.opened = false
      expect(DeliveryReportCtrl.stop.opened).toBeFalsy()
      DeliveryReportCtrl.stop.open(event)
      expect(DeliveryReportCtrl.stop.opened).toBeTruthy()
    })
  })

  it('should expose getReport and getRound methods', function () {
    spyOn(DeliveryReportCtrl, 'getReport')
    spyOn(DeliveryReportCtrl, 'getByRound')
    expect(DeliveryReportCtrl.getReport).toBeDefined()
    expect(DeliveryReportCtrl.getByRound).toBeDefined()
    DeliveryReportCtrl.getReport()
    DeliveryReportCtrl.getByRound('round1')
    DeliveryReportCtrl.getByRound()
    expect(DeliveryReportCtrl.getReport).toHaveBeenCalled()
    expect(DeliveryReportCtrl.getByRound).toHaveBeenCalled()

    rootScope.$digest()
  })
})
