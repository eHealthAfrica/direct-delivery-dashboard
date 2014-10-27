'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/users', {
        templateUrl: 'app/users/users.html',
        controller: 'UsersCtrl',
        controllerAs: 'main',
        authenticate: true,
        resolve: {
          states: ['State', function(State) {
            return State.names();
          }],
          zones: ['Zone', function(Zone) {
            return Zone.names();
          }],
          lgas: ['LGA', function(LGA) {
            return LGA.names();
          }],
          wards: ['Ward', function(Ward) {
            return Ward.names();
          }],
          users: ['User', function(User) {
            return User.query().$promise;
          }]
        }
      });
  });