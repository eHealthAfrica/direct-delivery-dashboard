'use strict'
/* global describe, beforeEach, it, inject, expect, module */

describe('NavbarCtrl', function () {
  beforeEach(module('navbar', 'navbarMock', 'navbarCtrlMock'))

  var NavbarCtrl

  beforeEach(inject(function ($controller) {
    NavbarCtrl = $controller('NavbarCtrl', {
      userStates: []
    })
  }))

  it('should expose the application name', function () {
    expect(NavbarCtrl.name).toBe('test')
  })
})
