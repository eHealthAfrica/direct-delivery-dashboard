'use strict'

/* global describe beforeEach inject module it expect jasmine */

describe('controller: CopyRoundTemplateDialogCtrl', function () {
  var $rootScope
  var scope
  var ctrl
  var deliveryService

  beforeEach(module('planning', 'modalMock', 'deliveryRoundMock', 'dailyDeliveryMock'))

  beforeEach(inject(function (_$rootScope_, _$controller_, _deliveryService_) {
    $rootScope = _$rootScope_
    scope = $rootScope.$new()
    deliveryService = _deliveryService_

    ctrl = _$controller_('CopyRoundTemplateDialogCtrl', {
      $rootScope: $rootScope,
      $scope: scope,
      deliveryService: deliveryService
    })
  }))

  it('should be defined', function () {
    expect(ctrl).toBeDefined()
  })

  it('should expose copy function', function () {
    expect(ctrl.copy).toEqual(jasmine.any(Function))
  })

  it('should change isLoading status when copy function is called', function () {
    expect(ctrl.isLoading).toBeFalsy()
    ctrl.selectedRoundId = 'KN-01'
    ctrl.copy()
    $rootScope.$digest()
    expect(ctrl.isLoading).toBeTruthy()
  })

  it('should log error and make isLoading false status when copy function is called and fails', function () {
    expect(ctrl.isLoading).toBeFalsy()
    ctrl.selectedRoundId = 'fail'
    ctrl.copy()
    $rootScope.$digest()
    expect(ctrl.isLoading).toBeFalsy()
  })
})
