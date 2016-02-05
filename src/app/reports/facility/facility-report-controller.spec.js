'use strict'
/* global describe, beforeEach, it, inject, expect, module spyOn */

describe('FacilityReportCtrl', function () {
  beforeEach(module('reports', 'config', 'dbServiceMock', 'authServiceMock'))

  var FacilityReportCtrl
  var rootScope

  var event = {
    preventDefault: function () {},
    stopPropagation: function () {}
  }
  beforeEach(inject(function ($controller, _$rootScope_) {
    rootScope = _$rootScope_
    FacilityReportCtrl = $controller('FacilityReportCtrl', { })
  }))

  it('should toggle the state of opened property', function () {
    FacilityReportCtrl.stop.opened = false
    expect(FacilityReportCtrl.stop.opened).toBeFalsy()
    FacilityReportCtrl.stop.open(event)
    expect(FacilityReportCtrl.stop.opened).toBeTruthy()
  })


  it('should expose the get report method', function () {

    expect(FacilityReportCtrl.getReport).toBeDefined()
    FacilityReportCtrl.getReport()
    var isFunction = angular.isFunction(FacilityReportCtrl.getReport)
    expect(isFunction).toBeTruthy()
    rootScope.$digest()
  })
})
