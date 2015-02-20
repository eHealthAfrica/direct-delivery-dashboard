'use strict';

angular.module('reports')
  .controller('ReportsCtrl', function(deliveryRounds) {
    this.deliveryRounds = deliveryRounds;
  });
