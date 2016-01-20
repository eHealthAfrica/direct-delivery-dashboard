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
      var params = {
        startkey: [state.name],
        endkey: [state.name, {}]
      }
      var view = 'dashboard-delivery-rounds/report-by-date'
      expect(deliveryRoundService.getBy).not.toHaveBeenCalled()
      expect(dbService.getView).not.toHaveBeenCalled()

      deliveryReportService.getDailyDeliveryReport((new Date().getDate()), (new Date().getDate()), state)
      expect(dbService.getView).toHaveBeenCalledWith(view, jasmine.any(Object))
      expect(deliveryRoundService.getBy).toHaveBeenCalledWith(params)
    })
  })

  describe('deliveryReportService.getDailyDeliveryReportByRound', function () {
    it('should expose getDailyDeliveryReport function', function () {
      expect(deliveryReportService.getDailyDeliveryReportByRound).toEqual(jasmine.any(Function))
    })

    it('should call dbService.getView', function () {
      var view = 'reports/by-rounds'
      var roundID = 'KN-07-2016'
      var options = {
        startkey: [roundID],
        endkey: [roundID, {}, {}]
      }
      expect(dbService.getView).not.toHaveBeenCalled()

      deliveryReportService.getDailyDeliveryReportByRound(roundID)
      expect(dbService.getView).toHaveBeenCalledWith(view, options)
    })
  })
})
