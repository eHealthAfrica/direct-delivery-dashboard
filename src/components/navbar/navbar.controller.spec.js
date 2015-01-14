'use strict';
/*eslint-env jasmine */
/*global module: false, inject: false */

describe('NavbarCtrl', function() {
  beforeEach(module('navbar', 'navbarMock', 'navbarCtrlMock'));

  var NavbarCtrl;
  var navbarItemsMock;

  beforeEach(inject(function($controller, _navbarItemsMock_) {
    NavbarCtrl = $controller('NavbarCtrl');
    navbarItemsMock = _navbarItemsMock_;
  }));

  it('should expose the application name', function() {
    expect(NavbarCtrl.name).toBe('test');
  });

  it('should expose a list of navbar items', function() {
    expect(NavbarCtrl.items).toEqual(navbarItemsMock);
  });
});
