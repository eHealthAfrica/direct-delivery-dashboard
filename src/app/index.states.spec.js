'use strict'
/* global describe it expect beforeEach inject */

describe('State resolve block', function () {
  var state
  var rootScope

  beforeEach(function () {
    module('directDeliveryDashboard')
  })

  beforeEach(inject(function ($rootScope, $state) {
    state = $state
    rootScope = $rootScope
  }))

  it('should resolve state', function (done) {
    var stateDetails = state.get('index')
    done()
    expect(stateDetails.views).toBeDefined()
    rootScope.$digest()
  })
})
