'use strict'

/* global describe, beforeEach, module, inject, it, expect, jasmine, spyOn */

describe('State: planning.returnRoute', function () {
  var $rootScope
  var state
  var authService
  var planningService
  var log
  var returnRouteService

  beforeEach(module('directDeliveryDashboard', 'planning'))

  beforeEach(inject(function (_$rootScope_, _$state_, _authService_, _planningService_, _log_, $q, _returnRouteService_) {
    $rootScope = _$rootScope_
    state = _$state_.get('planning.returnRoute')
    authService = _authService_
    planningService = _planningService_
    log = _log_
    returnRouteService = _returnRouteService_

    function ServiceMock (param) {
      var deferred = $q.defer()
      if (param === 'fail') {
        deferred.reject('reject')
      } else {
        deferred.resolve([])
      }
      return deferred.promise
    }

    spyOn(planningService, 'getByRoundId').and.callFake(ServiceMock)
    spyOn(returnRouteService, 'getBy').and.callFake(ServiceMock)
    spyOn(returnRouteService, 'getPackingStoreBy').and.callFake(ServiceMock)
  }))

  it('should be defined', function () {
    expect(state).toBeDefined()
  })

  it('should have resolve object', function () {
    expect(state.resolve).toEqual(jasmine.any(Object))
  })

  it('should have have resolve.authorization function', function () {
    expect(state.resolve.authorization).toEqual(jasmine.any(Function))
    state.resolve.authorization(authService, {roundId: 'KN-01'})
    $rootScope.$digest()
  })

  it('should have have resolve.deliveryRound function', function () {
    expect(state.resolve.deliveryRound).toEqual(jasmine.any(Function))
    state.resolve.deliveryRound(log, planningService, {roundId: 'KN-01'})
    $rootScope.$digest()
  })

  it('should have have resolve.deliveryReturnRoutes function', function () {
    expect(state.resolve.deliveryReturnRoutes).toEqual(jasmine.any(Function))
    state.resolve.deliveryReturnRoutes(log, returnRouteService, {roundId: 'fail'})
    $rootScope.$digest()
  })

  it('should have have resolve.packingStores function', function () {
    expect(state.resolve.packingStores).toEqual(jasmine.any(Function))
    state.resolve.packingStores(log, {_id: 'fail'}, returnRouteService)
    $rootScope.$digest()
  })
})
