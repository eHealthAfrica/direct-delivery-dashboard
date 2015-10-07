'use strict';
/*eslint-env jasmine */
/*global module: false, inject: false */

describe('NavbarCtrl', function() {
  beforeEach(module('navbar', 'navbarMock', 'navbarCtrlMock'));

  var NavbarCtrl;

  beforeEach(inject(function($controller) {
    NavbarCtrl = $controller('NavbarCtrl');
  }));

  it('should expose the application name', function() {
    expect(NavbarCtrl.name).toBe('test');
  });
});
