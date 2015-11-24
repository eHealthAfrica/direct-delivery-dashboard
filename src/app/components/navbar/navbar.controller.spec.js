'use strict'
/* global describe, beforeEach, it, inject, expect, module */

describe('NavbarCtrl', function () {
  beforeEach(module('navbar', 'navbarMock', 'navbarCtrlMock', 'utility'))

  var NavbarCtrl

  beforeEach(inject(function ($controller, $rootScope) {
    NavbarCtrl = $controller('NavbarCtrl', {
      userStates: [],
      $scope: $rootScope.$new()
    })
  }))

  it('should expose the application name', function () {
    expect(NavbarCtrl.name).toBe('test')
  })
})
