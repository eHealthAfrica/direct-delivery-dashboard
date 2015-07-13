'use strict';

angular.module('home')
  .config(function($stateProvider) {
    $stateProvider.state('home', {
      parent: 'index',
      url: '/',
      controller: 'HomeCtrl',
      controllerAs: 'homeCtrl',
      templateUrl: 'app/home/home.html',
      resolve: {
        roundReport: function(deliveryRoundService) {
          var key = 'KN-26-2015'; //TODO: replace with current round id.
          return deliveryRoundService.getReport(key)
              .then(function(rndReport) {
                rndReport.deliveryRoundID = key;
                return rndReport;
              })
              .catch(function(){
                var defaultReport = deliveryRoundService.getDefaultReport();
                defaultReport.deliveryRoundID = key;
                defaultReport.status = [];
                return defaultReport;
              });
        },
        roundCodes: function(deliveryRoundService) {
          return deliveryRoundService.getRoundCodes()
              .catch(function(){
                return [];
              });
        }
      },
      data: {
        label: 'Home'
      }
    });
  });
