'use strict'

/* global describe beforeEach inject module it expect jasmine */

describe('controller: CopyRoundTemplateDialogCtrl', function () {
  var $rootScope
  var scope
  var ctrl

  beforeEach(module('planning', 'modalMock', 'deliveryRoundMock'))

  beforeEach(inject(function (_$rootScope_, _$controller_) {
    $rootScope =_$rootScope_
    scope = $rootScope.$new()

    ctrl = _$controller_('CopyRoundTemplateDialogCtrl', {
      $rootScope: $rootScope,
      $scope: scope
    })
  }))

  it('should be defined', function () {
    expect(ctrl).toBeDefined()
  })

  xit('should expose copy function', function () {
    expect(ctrl.copy).toEqual(jasmine.any(Function))
  })

  it('should change isLoading status when copy function is called', function () {
    expect(ctrl.isLoading).toBeFalsy()
    ctrl.selectedRoundId = 'KN-01'
    ctrl.copy()
    expect(ctrl.isLoading).toBeTruthy()
  })
})
