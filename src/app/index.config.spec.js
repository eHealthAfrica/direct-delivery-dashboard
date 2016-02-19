'use strict'
/* global describe it expect beforeEach spyOn inject */

describe('ui router', function () {
  var compileProvider
  var logProvider
  var config

  beforeEach(function () {
    module('core', 'config')

    module(function ($provide, $compileProvider, $logProvider, _config_) {
      compileProvider = $compileProvider
      logProvider = $logProvider
      config = _config_
      config.disableDebug = true
      spyOn(compileProvider, 'debugInfoEnabled')
      spyOn(logProvider, 'debugEnabled')
    })

    module('directDeliveryDashboard')
  })

  beforeEach(inject())

  it('should call debugInfoEnabled with false', function () {
    expect(compileProvider.debugInfoEnabled).toBeDefined()
    expect(compileProvider.debugInfoEnabled).toHaveBeenCalledWith(false)
  })

  it('should call debugEnabled with false', function () {
    expect(logProvider.debugEnabled).toBeDefined()
    expect(logProvider.debugEnabled).toHaveBeenCalledWith(false)
  })
})
