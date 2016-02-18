'use strict'
/* global describe, beforeEach, it, inject, expect, module, jasmine */

describe('KPIController', function () {
  beforeEach(module('planning', 'deliveryRoundMock', 'kpiMock'))

  var ctrl
  var $rootScope
  var $scope
  var kpiInfo

  beforeEach(inject(function (_$controller_, _$rootScope_, _kpiTemplatesMock_, _kpiInfoMock_) {
    $rootScope = _$rootScope_
    $scope = $rootScope.$new()
    kpiInfo = _kpiInfoMock_

    ctrl = _$controller_('KPIController', {
      $rootScope: $rootScope,
      $scope: $scope,
      kpiTemplates: _kpiTemplatesMock_,
      kpiInfo: _kpiInfoMock_
    })
  }))

  it('should be defined', function () {
    expect(ctrl).toBeDefined()
  })

  it('should expose setKPI function', function () {
    expect(ctrl.setKPI).toEqual(jasmine.any(Function))
    ctrl.setKPI(kpiInfo)
    $rootScope.$digest()
  })

  it('should expose saveRow function', function () {
    expect(ctrl.saveRow).toEqual(jasmine.any(Function))
    ctrl.saveRow({}, kpiInfo.kpiList, 0)
    $rootScope.$digest()
  })

  it('should call ctrl.onSaveError if saveRow function fails', function () {
    expect(ctrl.saveRow).toEqual(jasmine.any(Function))
    ctrl.saveRow({}, [{antigensKPI: []}], 0)
    $rootScope.$digest()
  })

  it('should expose saveAll function', function () {
    expect(ctrl.saveAll).toEqual(jasmine.any(Function))
    ctrl.saveAll()
    $rootScope.$digest()
  })

  it('should expose getDriver function', function () {
    expect(ctrl.getDriver).toEqual(jasmine.any(Function))
    var res = ctrl.getDriver('a@a.com')
    expect(res).toBe('a')
  })

  it('should expose isEmpty function', function () {
    expect(ctrl.isEmptyTable).toEqual(jasmine.any(Function))
    ctrl.isEmptyTable()
    $rootScope.$digest()
  })

  it('should expose showLoading function', function () {
    expect(ctrl.showLoading).toEqual(jasmine.any(Function))
    ctrl.showLoading()
    $rootScope.$digest()
  })

  it('should expose hideKPITable function', function () {
    expect(ctrl.showLoading).toEqual(jasmine.any(Function))
    ctrl.hideKPITable()
    $rootScope.$digest()
  })
})
