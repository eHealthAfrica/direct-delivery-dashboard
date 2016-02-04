'use strict'

/* global describe inject expect jasmine spyOn it beforeEach module */

describe('delivery-round.service', function () {
  var deliveryRoundService
  var dbService
  var authService
  var locationService
  var planningService

  beforeEach(module('dbServiceMock', 'auth', 'planning', 'location', 'log', 'config', 'utility'))

  beforeEach(inject(function (_deliveryRoundService_, _dbService_, _authService_, _locationService_, _planningService_) {
    deliveryRoundService = _deliveryRoundService_
    dbService = _dbService_
    authService = _authService_
    locationService = _locationService_
    planningService = _planningService_

    spyOn(dbService, 'getView').and.callThrough()
    spyOn(authService, 'getUserSelectedState').and.callThrough()
    spyOn(authService, 'authorisedStates').and.callThrough()
    spyOn(authService, 'getCurrentUser').and.callThrough()
    spyOn(deliveryRoundService, 'getBy').and.callThrough()
    spyOn(locationService, 'getLocationsByLevelAndId').and.callThrough()
    spyOn(locationService, 'getLocationsByLevel').and.callThrough()
    spyOn(planningService, 'getByRoundId').and.callThrough()
  }))

  it('should expose a getDefaultReport function', function () {
    expect(deliveryRoundService.getDefaultReport).toEqual(jasmine.any(Function))
  })

  it('should create a roundReport object on getDefaultReport', function () {
    var res = deliveryRoundService.getDefaultReport()
    expect(res).toEqual(jasmine.any(Object))
  })

  it('should expose a collateZoneReport function', function () {
    expect(deliveryRoundService.collateZoneReport).toEqual(jasmine.any(Function))
  })

  it('should call deliveryRoundService.updateZoneStatusCount on collateZoneReport', function () {
    spyOn(deliveryRoundService, 'updateZoneStatusCount').and.callThrough()
    expect(deliveryRoundService.updateZoneStatusCount).not.toHaveBeenCalled()
    var res = deliveryRoundService.getDefaultReport()
    var row = {
      status: 'Success: 1st Attempt',
      zone: 'Nassarawa',
      onTime: 1,
      billable: 1,
      workingCCE: 1,
      delivered: 1,
      howMuchLate: 886088,
      lag: 1
    }
    deliveryRoundService.collateZoneReport(res, row)
    expect(deliveryRoundService.updateZoneStatusCount).toHaveBeenCalled()
  })

  it('should expose a updateZoneStatusCount function', function () {
    expect(deliveryRoundService.updateZoneStatusCount).toEqual(jasmine.any(Function))
  })
  it('should return an roundReport object on updateZoneStatusCount', function () {
    var rndReport = {
      status: {
        'Success: 1st Attempt': {
          zones: {
            Nassarawa: {
              _id: 'NG-NW-KN-NASSARAWA',
              _rev: '1-d89fd3402264e22379364b9ff95611aa',
              name: 'Nassarawa',
              osmId: '',
              'ancestors': [
                'NG',
                'NW',
                'KN',
                '',
                ''
              ],
              'doc_type': 'location',
              'level': '3'
            }
          }
        }
      },
      zone: 'Southern',
      onTime: 1,
      billable: 1,
      workingCCE: 1,
      delivered: 1,
      howMuchLate: -1279222,
      lag: 1
    }

    var res = deliveryRoundService.updateZoneStatusCount('Nassarawa', 'Success: 1st Attempt', rndReport)
    expect(res).toEqual(jasmine.any(Object))
  })
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
      .then(function (data) {
        console.log(data)
      })
    expect(dbService.getView).toHaveBeenCalledWith(view, params)
  })

  it('should expose getRoundCodes function', function () {
    expect(deliveryRoundService.getRoundCodes).toEqual(jasmine.any(Function))
  })

  it('should call dbService.getView from getRoundCodes function', function () {
    var view = 'delivery-rounds/all'
    expect(dbService.getView).not.toHaveBeenCalled()
    deliveryRoundService.getRoundCodes()
    expect(dbService.getView).toHaveBeenCalledWith(view)
  })

  it('should expose getBy function', function () {
    expect(deliveryRoundService.getBy).toEqual(jasmine.any(Function))
  })

  it('should call dbService.getView from getRoundCodes function', function () {
    var view = 'dashboard-delivery-rounds/by-state-and-end-date'
    var key = ''
    expect(dbService.getView).not.toHaveBeenCalled()
    deliveryRoundService.getBy(key)
    expect(dbService.getView).toHaveBeenCalledWith(view, key)
  })

  it('should expose a getByStateCode function', function () {
    expect(deliveryRoundService.getByStateCode).toEqual(jasmine.any(Function))
  })

  it('should call authService.getUserSelectedState from getByStateCode function', function () {
    var stateCode = 'KN'
    var authParam = true
    expect(authService.getUserSelectedState).not.toHaveBeenCalled()
    deliveryRoundService.getByStateCode(stateCode)
    expect(authService.getUserSelectedState).toHaveBeenCalledWith(authParam)
  })

  it('should expose a getLatestBy function', function () {
    expect(deliveryRoundService.getLatestBy).toEqual(jasmine.any(Function))
  })

  it('should call deliveryRoundService.getBy on getLatestBy function', function () {
    var state = 'KN'
    var params = {
      startkey: [ state ],
      endkey: [ state, {} ]
    }
    expect(deliveryRoundService.getBy).not.toHaveBeenCalled()
    deliveryRoundService.getLatestBy(state)

    expect(deliveryRoundService.getBy).toHaveBeenCalledWith(params)
  })

  it('should expose a getStateAdminLevels function', function () {
    expect(deliveryRoundService.getStateAdminLevels).toEqual(jasmine.any(Function))
  })

  it('should call authService.getCurrentUser on getStateAdminLevels function', function () {
    expect(authService.getCurrentUser).not.toHaveBeenCalled()
    deliveryRoundService.getStateAdminLevels()
    expect(authService.getCurrentUser).toHaveBeenCalled()
  })

  it('should expose a getDeliveryRound function', function () {
    expect(deliveryRoundService.getDeliveryRound).toEqual(jasmine.any(Function))
  })

  it('should call planningService.getByRoundId on getDeliveryRound function', function () {
    var roundId = 'KN-01-2016'
    expect(planningService.getByRoundId).not.toHaveBeenCalled()
    deliveryRoundService.getDeliveryRound(roundId)
    expect(planningService.getByRoundId).toHaveBeenCalledWith(roundId)
  })
})
