'use strict'

angular.module('finance')
  .config(function ($stateProvider, ehaCouchDbAuthServiceProvider) {
    $stateProvider.state('finance', {
      abstract: true,
      parent: 'index',
      url: '/finance',
      templateUrl: 'app/finance/finance.html',
      resolve: {
        authentication: ehaCouchDbAuthServiceProvider.requireAuthenticatedUser
      }
    })
  })
