'use strict';

angular.module('reports')
  .controller('ReportsRoundCtrl', function($stateParams, deliveryRounds, dailyDeliveries) {
    this.dailyDeliveries = dailyDeliveries;

    if ($stateParams.id) {
      for (var i=0; i < deliveryRounds.length; i++) {
        var round = deliveryRounds[i];
        if (round._id == $stateParams.id) {
          this.deliveryRound = round;
          break;
        }
      }
    }
  });
