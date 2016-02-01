'use strict'

/* global describe inject expect jasmine spyOn it beforeEach module */

describe('delivery-round.service', function () {
  var deliveryRoundService
  var dbService
  var authService
  var utility
  var locationService
  var planningService
  var log
  var config
  var pouchUtil

  beforeEach(module('db', 'auth', 'planning', 'location', 'log', 'config', 'utility'))

  beforeEach(inject(function (_deliveryRoundService_, _dbService_, _authService_, _utility_, _locationService_, _planningService_, _log_, _config_, _pouchUtil_) {
    deliveryRoundService = _deliveryRoundService_
    dbService = _dbService_
    authService = _authService_
    utility = _utility_
    locationService = _locationService_
    planningService = _planningService_
    log = _log_
    config = _config_
    pouchUtil = _pouchUtil_

    spyOn(dbService, 'getView').and.callThrough()
  }))

  it('should expose a collateReport function', function () {
    expect(deliveryRoundService.collateZoneReport).toEqual(jasmine.any(Function))
  })
  it('should take array param for collateReport function and return an object', function () {
    var arr = {
      rows: []
    }
    var res = deliveryRoundService.collateReport(arr)
    expect(res).toEqual(jasmine.any(Object))
  })

  it('should expose a getReport function', function () {
    expect(deliveryRoundService.getReport).toEqual(jasmine.any(Function))
  })
  it('should call dbService.getView on getReport function', function () {
    var view = 'dashboard-delivery-rounds/report-by-round'
    var roundId = 'KN-01-2016'
    var params = {
      startkey: [ roundId ],
      endkey: [ roundId, {} ]
    }
    expect(dbService.getView).not.toHaveBeenCalled()

    deliveryRoundService.getReport(roundId)

    expect(dbService.getView).toHaveBeenCalledWith(view, params)
  })
})
