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
          var key = 'KN-78-2015';
          return deliveryRoundService.getReport(key)
        }
      },
      data: {
        label: 'Home'
      }
    });
  });
