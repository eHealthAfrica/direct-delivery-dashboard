'use strict'

angular.module('auth')
  .service('authService', function (
    $q,
    $state,
    log,
    config,
    navbarService,
    ehaCouchDbAuthService,
    dbService
  ) {
    this.requireRoles = function (roles) {
      roles = roles || []
      // Always authorise admins
      // TODO: remove depending on
      //       https://github.com/eHealthAfrica/angular-eha.couchdb-auth/issues/28
      roles = roles.concat(config.admin.roles)

      function hasRoles (user) {
        return user.hasRole(roles) ? true : $q.reject('unauthorized')
      }

      return ehaCouchDbAuthService.getCurrentUser()
        .then(hasRoles)
    }

    this.login = function (username, password) {
      var params = {
        username: username,
        password: password
      }

      return dbService.login(username, password)
        .then(ehaCouchDbAuthService.signIn.bind(null, params))
        .then(navbarService.updateItems.bind(null))
        .then(log.success.bind(log, 'authSuccess'))
        .then($state.go.bind($state, 'home'))
        .catch(log.error.bind(log))
    }

    this.logout = function () {
      return ehaCouchDbAuthService.signOut()
        .then(navbarService.updateItems.bind())
        .then($state.go.bind($state, 'login'))
        .catch(log.error.bind(log, 'logoutFailed'))
    }
  })
