'use strict'

/* global describe, beforeEach, it, inject, expect, module, jasmine  */

describe('Controller: AddFacilityDialogCtrl', function () {
  var ctrl
  var $rootScope
  var scope

  beforeEach(module('planning', 'dbServiceMock', 'deliveryRoundMock', 'modalMock', 'locationServiceMock'))

  beforeEach(inject(function (_$rootScope_, _$controller_) {
    $rootScope = _$rootScope_
    scope = $rootScope.$new()

    ctrl = _$controller_('AddFacilityDialogCtrl', {
      $scope: scope,
      $rootScope: $rootScope,
      selectedStateID: 'KN'
    })
  }))

  it('should be defined', function () {
    expect(ctrl).toBeDefined()
  })

  it('should expose onSelection function', function () {
    expect(ctrl.onSelection).toEqual(jasmine.any(Function))
  })

  it('should have onSelection callable with a parameter', function () {
    ctrl.onSelection(6)
    $rootScope.$digest()
  })

  it('should have onSelection callable without a parameter', function () {
    ctrl.onSelection()
    $rootScope.$digest()
  })

  it('should have addToList function', function () {
    ctrl.locations = {
      selected: [{}]
    }
    ctrl.addToList()
    $rootScope.$digest()
  })

  it('should have addToList function log error if locations.selected is empty', function () {
    ctrl.locations = {
      selected: []
    }
    ctrl.addToList()
    $rootScope.$digest()
  })

  it('should have selectAllToggle function', function () {
    expect(ctrl.selectAllToggle).toEqual(jasmine.any(Function))

    ctrl.selectAllToggle()
    expect(ctrl.locations.selected).toEqual([])
  })
})
