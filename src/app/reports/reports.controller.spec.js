'use strict';
/*eslint-env jasmine */
/*global module: false, inject: false */

describe('reportsCtrl', function() {
  var reportsCtrl;
  var deliveryRounds;

  beforeEach(module('reports', 'reportsMock'));

  beforeEach(inject(function($controller, _deliveryRounds_) {
    reportsCtrl = $controller('ReportsCtrl');
    deliveryRounds = _deliveryRounds_;
  }));

  it('should expose delivery rounds', function() {
    expect(reportsCtrl.deliveryRounds).toEqual(deliveryRounds);
  });
});
