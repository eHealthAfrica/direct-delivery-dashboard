'use strict'

/* global module, inject, beforeEach, describe, it, expect jasmine */

describe('deliveryRoundService', function () {
  var rootScope
  var deliveryRoundService

  beforeEach(module('planning', 'dbServiceMock', 'authServiceMock'))

  beforeEach(inject(function (_$rootScope_, _deliveryRoundService_) {
    rootScope = _$rootScope_
    deliveryRoundService = _deliveryRoundService_
  }))

  it('should expose a getReport function', function (done) {
    deliveryRoundService.getReport()
      .then(function (res) {
        expect(res.onTime).toBeDefined()
        expect(res.behindTime).toBeDefined()
        expect(res.total).toBeDefined()
        expect(res.workingCCE).toBeDefined()
        expect(res.delivered).toBeDefined()
        expect(res.billable).toBeDefined()
        expect(res.status).toEqual(jasmine.any(Array))
        done()
      })
    rootScope.$digest()
  })

  /* it('should expose a getStateAdminLevels', function (done) {
    deliveryRoundService.getStateAdminLevels()
      .then(function (data) {
        console.log(data)
        done()
      })
    rootScope.$digest()
  })*/

  it('should expose getDeliveryRound', function (done) {
    deliveryRoundService.getDeliveryRound('KN-01-2016')
      .then(function (res) {
        expect(res).toEqual(jasmine.any(Object))
        done()
      })
    rootScope.$digest()
  })

  it('should expose getLatestBy', function (done) {
    deliveryRoundService.getLatestBy()
      .then(function (res) {
        expect(res.latestRoundId).toBeDefined()
        expect(res.roundCodes).toEqual(jasmine.any(Array))
        done()
      })
    rootScope.$digest()
  })

  it('should expose getByStateCode function', function (done) {
    deliveryRoundService.getByStateCode('KN')
      .then(function (res) {
        console.log(res)
        done()
      })
    rootScope.$digest()
  })
})
