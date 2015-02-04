'use strict';
/*eslint-env jasmine */
/*global module: false, inject: false */

describe('reportsService', function() {
  var rootScope;
  var reportsService;
  var deliveryRounds;
  var dailyDeliveries;

  beforeEach(module('reports', 'reportsMock'));

  beforeEach(inject(function(_$rootScope_, _reportsService_, _deliveryRounds_, _dailyDeliveries_) {
    rootScope = _$rootScope_;
    reportsService = _reportsService_;
    deliveryRounds = _deliveryRounds_;
    dailyDeliveries = _dailyDeliveries_;
  }));

  it('should return delivery rounds correctly structured', function(done) {
    reportsService.getDeliveryRounds()
      .then(function(rounds) {
        expect(rounds.length).toEqual(deliveryRounds.length);

        for (var i = 0; i < rounds.length; i++) {
          var round = rounds[i];
          var mock = deliveryRounds[i];

          expect(round.id).toEqual(mock.id);
          expect(round.state).toEqual(mock.key[0]);
          expect(round.startDate).toEqual(new Date(mock.key[1]));
          expect(round.endDate).toEqual(new Date(mock.value.endDate));
          expect(round.roundCode).toEqual(mock.value.roundCode);
        }

        done();
      });

    rootScope.$digest();
  });

  it('should return daily deliveries correctly structured', function(done) {
    reportsService.getDailyDeliveries()
      .then(function(deliveries) {
        expect(deliveries.length).toEqual(dailyDeliveries.length);

        for (var i = 0; i < deliveries.length; i++) {
          var delivery = deliveries[i];
          var mock = dailyDeliveries[i];

          expect(delivery.driverID).toEqual(mock.key[1]);
          expect(delivery.date).toEqual(new Date(mock.key[2]));
          expect(delivery.drop).toEqual(mock.key[3]);
          expect(delivery.window).toEqual(mock.value.window);
          expect(delivery.signature).toEqual(mock.value.signature);
          expect(delivery.facility).toEqual(mock.value.facility);
        }

        done();
      });

    rootScope.$digest();
  });
});
