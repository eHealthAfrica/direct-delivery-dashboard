'use strict';

angular.module('auth')
  .service('authService', function($q, config, ehaCouchDbAuthService) {
    this.requireRoles = function(roles) {
      roles = roles || [];
      // Always authorise admins
      // TODO: remove depending on
      //       https://github.com/eHealthAfrica/angular-eha.couchdb-auth/issues/28
      roles = roles.concat(config.admin.roles);

      function hasRoles(user) {
        return user.hasRole(roles) ? true : $q.reject('unauthorized');
      }

      return ehaCouchDbAuthService.getCurrentUser()
        .then(hasRoles);
    };
  });
