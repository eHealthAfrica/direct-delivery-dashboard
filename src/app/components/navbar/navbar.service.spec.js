'use strict';
/*eslint-env jasmine */
/*global module: false, inject: false */

describe('navbarService', function() {
  beforeEach(module('navbar', 'navbarMock'));

  var navbarService;

  beforeEach(inject(function(_navbarService_) {
    navbarService = _navbarService_;
  }));

  it('should only include one state of a given hierarchy', function() {
    var items = navbarService.get();
    expect(items.length).toEqual(1);
  });
});
