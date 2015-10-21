'use strict'

angular.module('auth')
  .service('authService', function (
    $q,
    $state,
    log,
    config,
    navbarService,
    ehaCouchDbAuthService
  ) {
    var self = this

    this.login = function (username, password) {
      var params = {
        username: username,
        password: password
      }

      return ehaCouchDbAuthService.signIn(params)
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

    this.authorisedStates = function (user) {
      // TODO: get this from role lib
      var prefix = 'direct_delivery_dashboard_state_'

      function isState (role) {
        return role.indexOf(prefix) !== -1
      }

      function format (role) {
        var state = role.split(prefix)[1]
        return state.toUpperCase()
      }

      return user.roles
        .filter(isState)
        .map(format)
    }

    this.hasStateRole = function (roundId) {
      // TODO: get this from role lib
      var prefix = 'direct_delivery_dashboard_state_'

      // TODO: make this more robust
      var stateCode = roundId.split('-')[0]

      var role = prefix + stateCode.toLowerCase()
      return self.requireRoles([
        role
      ])
    }
  })
