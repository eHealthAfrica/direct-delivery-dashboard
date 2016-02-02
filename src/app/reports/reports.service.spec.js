'use strict'
/* global module, inject, beforeEach, describe, it, expect */

describe('reportsService', function () {
  var rootScope
  var reportsService
  var deliveryRounds
  var dailyDeliveries

  beforeEach(module('reports', 'reportsMock', 'utility'))

  beforeEach(inject(function (_$rootScope_, _reportsService_, _deliveryRounds_, _dailyDeliveries_) {
    rootScope = _$rootScope_
    reportsService = _reportsService_
    deliveryRounds = _deliveryRounds_
    dailyDeliveries = _dailyDeliveries_
  }))

  it('should return delivery rounds correctly structured', function (done) {
    reportsService.getDeliveryRounds({})
      .then(function (rounds) {
        expect(rounds.results.length).toEqual(deliveryRounds.length)
        for (var i = 0; i < rounds.results.length; i++) {
          var round = rounds.results[i]
          var mock = deliveryRounds[i]
          expect(round.id).toEqual(mock.id)
          expect(round.state).toEqual(mock.key[0])
          expect(round.startDate).toEqual(new Date(mock.key[1]))
          expect(round.endDate).toEqual(new Date(mock.value.endDate))
          expect(round.roundCode).toEqual(mock.value.roundCode)
        }

        done()
      })

    rootScope.$digest()
  })

  it('should return daily deliveries correctly structured', function (done) {
    reportsService.getDailyDeliveries()
      .then(function (deliveries) {
        expect(deliveries.results.length).toEqual(dailyDeliveries.length)
        for (var i = 0; i < deliveries.results.length; i++) {
          var delivery = deliveries.results[i]
          var mock = dailyDeliveries[i]
          expect(delivery.id).toEqual(mock.id)
          expect(delivery.driverID).toEqual(mock.key[1])
          expect(delivery.date).toEqual(new Date(mock.key[2]))
          expect(delivery.drop).toEqual(mock.key[3])
          expect(delivery.status).toEqual(mock.value.status)
          expect(delivery.window).toEqual(mock.value.window)
          expect(delivery.signature).toEqual(mock.value.signature)
          expect(delivery.facility).toEqual(mock.value.facility)
        }
        done()
      })

    rootScope.$digest()
  })

  it('should return total rows found in delivery rounds query', function (done) {
    reportsService.getRoundsCount()
      .then(function (deliveryRoundCount) {
        var mock = deliveryRounds
        var rows = deliveryRoundCount.rows
        expect(rows.length).toEqual(1)
        expect(mock.length).toEqual(rows[0].value)
        done()
      })

    rootScope.$digest()
  })

  it('should return total rows found in daily delivery query', function (done) {
    reportsService.getDailyDeliveriesCount()
      .then(function (deliveryCount) {
        var mock = dailyDeliveries
        var rows = deliveryCount.rows
        expect(rows.length).toEqual(1)
        expect(mock.length).toEqual(rows[0].value)
        done()
      })

    rootScope.$digest()
  })
})
