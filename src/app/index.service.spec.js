'use strict'
/* global describe expect it beforeEach module inject spyOn */

describe('Index Service', function () {
  var log
  var state
  var rootScope
  var window
  var indexService
  beforeEach(module('directDeliveryDashboard'))

  beforeEach(inject(function (_indexService_, _$rootScope_, _log_, _$window_, _$state_) {
    log = _log_
    state = _$state_
    window = _$window_
    rootScope = _$rootScope_
    indexService = _indexService_
  }))

  it('should load login page if $stateChangeError event is triggered with unauthenticated', function () {
    expect(indexService.bootstrap).toBeDefined()
    spyOn(state, 'go')
    rootScope.$emit('$stateChangeError', '', '', '', '', 'unauthenticated')
    indexService.bootstrap()
    expect(state.go).toHaveBeenCalledWith('login')
    rootScope.$digest()
  })

  it('should log error message if $stateChangeError event is triggered with unauthorized', function () {
    expect(indexService.bootstrap).toBeDefined()
    spyOn(log, 'error')
    var event = rootScope.$emit('$stateChangeError', '', '', '', '', 'unauthorized')
    indexService.bootstrap()
    expect(log.error).toHaveBeenCalledWith('unauthorizedAccess', event)
    rootScope.$digest()
  })

  it('should log error message if $stateChangeError event is triggered with unknownError', function () {
    expect(indexService.bootstrap).toBeDefined()
    spyOn(log, 'error')
    var event = rootScope.$emit('$stateChangeError', '', '', '', '', 'unknownError')
    indexService.bootstrap()
    expect(log.error).toHaveBeenCalledWith('stateChangeError', event)
    rootScope.$digest()
  })

  it('should log warning message when unauthorized event is fired', function () {
    expect(indexService.bootstrap).toBeDefined()
    spyOn(log, 'warning')
    rootScope.$emit('unauthorized', '')
    indexService.bootstrap()
    expect(log.warning).toHaveBeenCalledWith('accessDeniedOrExpired')
    rootScope.$digest()
  })

  it('should reset chart data on state change start', function () {
    window.nv.charts.data = []
    expect(indexService.bootstrap).toBeDefined()
    rootScope.$emit('$stateChangeStart', '', '', '', '', '')
    indexService.bootstrap()
    expect(window.nv.charts).toEqual({})
    rootScope.$digest()
  })
})
