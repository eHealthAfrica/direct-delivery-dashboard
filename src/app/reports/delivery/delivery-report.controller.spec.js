'use strict'
/* global describe, beforeEach, it, inject, expect, module spyOn */

describe('DeliveryReportCtrl', function () {
  beforeEach(module('reports', 'config', 'dbServiceMock', 'authServiceMock'))

  var DeliveryReportCtrl
  var rootScope
  var event = {
    preventDefault: function () {},
    stopPropagation: function () {}
  }
  beforeEach(inject(function ($controller, _$rootScope_) {
    rootScope = _$rootScope_
    DeliveryReportCtrl = $controller('DeliveryReportCtrl', {
      $scope: rootScope.$new()
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
    expect(DeliveryReportCtrl.getReport).toBeDefined()
    expect(DeliveryReportCtrl.getByRound).toBeDefined()
    DeliveryReportCtrl.getReport()
    DeliveryReportCtrl.getByRound('round1')
    DeliveryReportCtrl.getByRound()

    rootScope.$digest()
  })

  it('should reset view data on root broadcast', function () {
    spyOn(DeliveryReportCtrl, 'getReport')
    rootScope.$broadcast('stateChanged', {state: {name: 'State 1', _id: 'STATEID'}})
    expect(DeliveryReportCtrl.getReport).toHaveBeenCalled()

    rootScope.$digest()
  })

  it('should reset view data on root broadcast', function () {
    var formatted_X = DeliveryReportCtrl.formatXAxis()(4)
    var formatted_Y = DeliveryReportCtrl.formatYAxis()(4)
    expect(formatted_X).toEqual(4)
    expect(formatted_Y).toEqual('4%')
  })
})
