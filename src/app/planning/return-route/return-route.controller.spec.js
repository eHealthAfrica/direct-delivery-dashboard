'use strict'
/* global describe, beforeEach, it, inject, expect, module, spyOn */

describe('ReturnRouteCtrl', function () {
  var $rootScope
  var ctrl
  var packingStore = {
    _id: 'ps1',
    name: 'Nassarawa Zonal'
  }

  beforeEach(module('planning', 'deliveryMock', 'deliveryRoundMock', 'returnRouteMock'))


  beforeEach(inject(function (_$controller_, _$rootScope_) {
    $rootScope = _$rootScope_

    ctrl = _$controller_('ReturnRouteCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new(),
      packingStores: packingStore
    })
  }))

  it('should be defined', function () {
    expect(ctrl).toBeDefined()
  })

  it('should expose saveRow function', function () {
    expect(ctrl.saveRow).toEqual(jasmine.any(Function))
    ctrl.saveRow({p: 'value'}, 'abdullahi@example.com', '2015-05-21')
    $rootScope.$digest()
  })

  it('should expose isEmptyReturnRoutes function', function () {
    expect(ctrl.isEmptyReturnRoutes).toEqual(jasmine.any(Function))
    ctrl.isEmptyReturnRoutes()
  })
})
