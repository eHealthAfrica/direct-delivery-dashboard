'use strict';

angular.module('home')
  .config(function($stateProvider) {
    $stateProvider.state('home', {
      parent: 'index',
      url: '/',
      controller: 'HomeCtrl',
      controllerAs: 'homeCtrl',
      templateUrl: 'app/home/home.html',
      data: {
        label: 'Home'
      }
    });
  });
