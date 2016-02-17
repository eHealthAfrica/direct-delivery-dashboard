'use strict'

/* global describe beforeEach module inject it expect spyOn jasmine */

describe('State: planning.kpi', function () {
  var state
  var $rootScope
  var planningService
  var log
  var kpiService
  beforeEach(module('directDeliveryDashboard', 'planning'))

  beforeEach(inject(function (_$rootScope_, _$state_, _planningService_, _log_, $q, _kpiService_) {
    state = _$state_.get('planning.kpi')
    $rootScope = _$rootScope_
    planningService = _planningService_
    log = _log_
    kpiService = _kpiService_

    function kpiServiceMock (param) {
      var deferred = $q.defer()
      if (param === 'fail') {
        deferred.reject('reject')
      } else {
        deferred.resolve([])
      }
      return deferred.promise
    }

    spyOn(planningService, 'getByRoundId').and.callFake(kpiServiceMock)
    spyOn(kpiService, 'getByRoundId').and.callFake(kpiServiceMock)
    spyOn(kpiService, 'getAllTemplates').and.callFake(function () {
      return $q.when([])
    })
  }))

  it('should be object', function () {
    expect(state).toEqual(jasmine.any(Object))
  })

  it('should have resolve object', function () {
    expect(state.resolve).toEqual(jasmine.any(Object))
  })

  it('should resolve deliveryRound', function (done) {
    expect(state.resolve.deliveryRound).toEqual(jasmine.any(Function))

    state.resolve.deliveryRound(log, planningService, {roundId: 'KN-01'})
      .then(function (res) {
        expect(res).toEqual(jasmine.any(Array))
        done()
      })
    $rootScope.$digest()
  })

  it('should resolve kpiTemplates', function (done) {
    expect(state.resolve.kpiTemplates).toEqual(jasmine.any(Function))

    state.resolve.kpiTemplates(kpiService)
      .then(function (res) {
        expect(res).toEqual(jasmine.any(Array))
        done()
      })
    $rootScope.$digest()
  })

  it('should resolve kpiInfo', function (done) {
    expect(state.resolve.kpiInfo).toEqual(jasmine.any(Function))

    state.resolve.kpiInfo(log, kpiService, {roundId: 'KN-01'})
      .then(function (res) {
        expect(res).toEqual(jasmine.any(Array))
        done()
      })

    state.resolve.kpiInfo(log, kpiService, {roundId: 'fail'})
      .then(function (res) {
        expect(res).toEqual(jasmine.any(Object))
        done()
      })
    $rootScope.$digest()
  })

  it('should reject kpiInfo with an object with two arrays antigens and kpiList', function (done) {
    state.resolve.kpiInfo(log, kpiService, {roundId: 'fail'})
      .then(function (res) {
        expect(res).toEqual(jasmine.any(Object))
        expect(res.antigens).toEqual(jasmine.any(Array))
        expect(res.kpiList).toEqual(jasmine.any(Array))
        done()
      })
    $rootScope.$digest()
  })
})
