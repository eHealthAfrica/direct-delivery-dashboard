'use strict';

angular.module('auth')
  .service('authService', function($q, ehaCouchDbAuthService) {
    this.requireRoles = function(roles) {
      function hasRoles(user) {
        return user.hasRole(roles) ? true : $q.reject('unauthorized');
      }

      return ehaCouchDbAuthService.getCurrentUser()
        .then(hasRoles);
    };
  });
