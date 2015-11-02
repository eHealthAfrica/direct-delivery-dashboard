'use strict'

angular.module('auth')
  .config(function (config, ehaCouchDbAuthServiceProvider) {
    ehaCouchDbAuthServiceProvider.config({
      url: config.baseUrl,
      localStorageNamespace: config.name,
      adminRoles: config.roles.admin.roles,
      userRoles: config.roles.user.roles,
      defaultHttpFields: {
        withCredentials: true
      }
    })
  })
