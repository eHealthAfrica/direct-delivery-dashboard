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
          var key = 'KN-78-2015';//TODO: replace with current round id.
          return deliveryRoundService.getReport(key)
              .catch(function(err){
                console.log(err);
                return {
                  deliveryRoundID: key,
                  onTime: 0,
                  behindTime: 0,
                  total: 0,
                  workingCCE: 0,
                  delivered: 0,
                  billables: 0
                };
              });
        }
      },
      data: {
        label: 'Home'
      }
    });
  });
