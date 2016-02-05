'use strict'
/* global describe, beforeEach, it, inject, expect, module spyOn*/

describe('DeliveryReportByZonesCtrl', function () {
  beforeEach(module('reports', 'config', 'dbServiceMock', 'authServiceMock'))

  var DeliveryReportByZonesCtrl
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
    DeliveryReportByZonesCtrl = $controller('DeliveryReportByZonesCtrl', {
      $scope: scope
    })
  }))

  it('should toggle the state of opened property', function () {
    DeliveryReportByZonesCtrl.filteredReport.stop.opened = false
    expect(DeliveryReportByZonesCtrl.filteredReport.stop.opened).toBeFalsy()
    DeliveryReportByZonesCtrl.filteredReport.stop.open(event)
    expect(DeliveryReportByZonesCtrl.filteredReport.stop.opened).toBeTruthy()
  })

  it('should split text by "-" and return by type', function () {
    var name = 'lga 1-zone 1'
    var zone = DeliveryReportByZonesCtrl.splitResult(name, 'zone')
    var lga = DeliveryReportByZonesCtrl.splitResult(name, 'lga')
    expect(zone).toEqual('zone 1')
    expect(lga).toEqual('lga 1')
  })

  it('should sum object values and return a primitive int value', function () {
    // expects object to contain keys like success, failed and canceled
    var value1 = DeliveryReportByZonesCtrl.sum({})
    var value2 = DeliveryReportByZonesCtrl.sum({success: 1, failed: 2, notExpected: 3})
    var value3 = DeliveryReportByZonesCtrl.sum({success: 1, failed: 2, canceled: 3})
    expect(value1).toEqual(0)
    expect(value2).toEqual(3)
    expect(value3).toEqual(6)
  })

  it('should expose properties and methods in controller', function () {
    expect(DeliveryReportByZonesCtrl.loadReport).toBeDefined()
    spyOn(DeliveryReportByZonesCtrl, 'loadReport')
    DeliveryReportByZonesCtrl.loadReport()
    expect(DeliveryReportByZonesCtrl.loadReport).toHaveBeenCalled()
    DeliveryReportByZonesCtrl.updateReport('round1')
    DeliveryReportByZonesCtrl.updateReport()
    rootScope.$digest()
  })
})
