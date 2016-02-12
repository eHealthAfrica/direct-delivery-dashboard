'use strict'

/* global describe, beforeEach, it, inject, expect, module, jasmine  */

describe('Controller: AddFacilityDialogCtrl', function () {
  var ctrl
  var rootScope
  var scope

  beforeEach(module('planning', 'dbServiceMock'))

  beforeEach(inject(function (_$rootScope_, _$controller_) {
    rootScope = _$rootScope_
    scope = rootScope.$new()

    ctrl = _$controller_('AddFacilityDialogCtrl', {
      $scope: scope,
      $rootScope: rootScope
    })
  }))

  it('should be defined', function () {
    expect(ctrl).toBeDefined()
  })
})
