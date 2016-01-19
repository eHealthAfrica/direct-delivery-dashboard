/* global describe, beforeEach, it, inject, expect, module, spyOn, jasmine */

describe('delivery-report-service', function () {
  beforeEach(module('reports'))

  var deliveryReportService
  var deliveryRoundService
  var dbService
  var state

  beforeEach(inject(function (_deliveryReportService_, _deliveryRoundService_, _dbService_) {
    deliveryReportService = _deliveryReportService_
    deliveryRoundService = _deliveryRoundService_
    dbService = _dbService_

    spyOn(dbService, 'getView').and.callThrough()
    spyOn(deliveryRoundService, 'getBy').and.callThrough()
  }))

  it('should be defined', function () {
    expect(deliveryReportService).toBeDefined()
  })

  describe('deliveryReportService.getDailyDeliveryReport', function () {
    it('should expose getDailyDeliveryReport function', function () {
      expect(deliveryReportService.getDailyDeliveryReport).toEqual(jasmine.any(Function))
    })

    it('should call dbService.getView and deliveryRoundService.getBy', function () {
      state = {
        _id: 'KN',
        name: 'Kano'
      }

      deliveryReportService.getDailyDeliveryReport((new Date().getDate()), (new Date().getDate()), state)
      expect(dbService.getView).toHaveBeenCalled()
      expect(deliveryRoundService.getBy).toHaveBeenCalled()
    })
  })

  describe('deliveryReportService.getDailyDeliveryReportByRound', function () {
    it('should expose getDailyDeliveryReport function', function () {
      expect(deliveryReportService.getDailyDeliveryReportByRound).toEqual(jasmine.any(Function))
    })

    it('should call dbService.getView', function () {
      deliveryReportService.getDailyDeliveryReportByRound('KN-07-2016')
      expect(dbService.getView).toHaveBeenCalled()
    })
  })
})
