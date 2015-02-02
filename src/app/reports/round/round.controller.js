'use strict';

angular.module('reports')
  .controller('ReportsRoundCtrl', function($stateParams, deliveryRounds, dailyDeliveries, drivers, ZONE_CLASS) {
    var keys = ['driverID', 'date'];
    var keyRows = {};
    var lastKeyValues = [];

    this.dailyDeliveries = dailyDeliveries;
    this.drivers = drivers;
    this.zoneClass = {};

    this.keyStates = function(delivery, index) {
      var states = {};
      var value = '';
      angular.forEach(keys, function(key) {
        value += delivery[key];

        states[key] = {
          rows: keyRows[value],
          changed: !lastKeyValues[index - 1] || value != lastKeyValues[index - 1][key]
        };

        if (!lastKeyValues[index])
          lastKeyValues[index] = {};

        lastKeyValues[index][key] = value;
      });

      return states;
    };

    this.print = function() {
      $("#report").print();
    };

    angular.forEach(dailyDeliveries, function(delivery) {
      var value = '';
      angular.forEach(keys, function(key) {
        value += delivery[key];

        if (keyRows[value])
          keyRows[value]++;
        else
          keyRows[value] = 1;
      });
    });

    if ($stateParams.id) {
      for (var i = 0; i < deliveryRounds.length; i++) {
        var round = deliveryRounds[i];
        if (round._id == $stateParams.id) {
          this.deliveryRound = round;
          this.zoneClass = ZONE_CLASS[round.state];
          break;
        }
      }
    }
  });
