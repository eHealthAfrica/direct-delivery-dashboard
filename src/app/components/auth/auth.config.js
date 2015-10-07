'use strict';

angular.module('auth')
  .config(function(config, ehaCouchDbAuthServiceProvider) {
    ehaCouchDbAuthServiceProvider.config({
      url: config.baseUrl,
      localStorageNamespace: config.name,
      adminRoles: config.admin.roles,
      userRoles: config.user.roles
    });
  });
