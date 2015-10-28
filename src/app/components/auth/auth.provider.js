'use strict'

angular.module('auth')
  .provider('auth', function (ehaCouchDbAuthServiceProvider) {
    this.$get = angular.noop
    this.requireAdminUser = ehaCouchDbAuthServiceProvider.requireAdminUser
    this.requireAuthenticatedUser = ehaCouchDbAuthServiceProvider.requireAuthenticatedUser
    this.requireUserWithRoles = ehaCouchDbAuthServiceProvider.requireUserWithRoles
  })
