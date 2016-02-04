'use strict'
/* global module, inject, beforeEach, describe, it, expect */

describe('delivery-report-service', function () {
  beforeEach(module('reports', 'dbServiceMock'))

  var deliveryReportService
  var rootScope
  var selectedState = {
    name: 'State1',
    _id: 'STATEID'
  }

  beforeEach(inject(function (_$rootScope_, _deliveryReportService_) {
    deliveryReportService = _deliveryReportService_
    rootScope = _$rootScope_
  }))

  describe('deliveryReportService.getDailyDeliveryReport', function () {
    it('should return formatted data structure ', function (done) {
      deliveryReportService.getDailyDeliveryReport('2015-01-01', '2015-01-01', selectedState)
        .then(function (response) {
          expect(response).toBeDefined()
          expect(response.byZoneByLGA).toBeDefined()
          done()
        })

      rootScope.$digest()
    })
  })

  describe('deliveryReportService.getDailyDeliveryReportByRound', function () {
    it('should return formatted data structure ', function (done) {
      deliveryReportService.getDailyDeliveryReportByRound('round2')
        .then(function (response) {
          expect(response).toBeDefined()
          expect(response.byZoneByLGA).toBeDefined()
          done()
        })

      rootScope.$digest()
    })
  })
})
