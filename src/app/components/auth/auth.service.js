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
    this.login = function (username, password) {
      var params = {
        username: username,
        password: password
      }

      function handleError (err) {
        var reason
        if (err && err.message) {
          reason = 'The error message was: "' + err.message + '"'
        }
        log.error('loginFailed', err, reason)
      }

      return ehaCouchDbAuthService.signIn(params)
        .then(navbarService.updateItems.bind(null))
        .then(navbarService.updateUsername.bind(null))
        .then(log.success.bind(log, 'authSuccess'))
        .then($state.go.bind($state, 'home'))
        .catch(handleError)
    }

    this.logout = function () {
      return ehaCouchDbAuthService.signOut()
        .then(navbarService.updateItems.bind())
        .then(navbarService.updateUsername.bind())
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

    this.roundToStateRole = function (roundId) {
      // TODO: get this from role lib
      var prefix = 'direct_delivery_dashboard_state_'

      // TODO: make this more robust
      var stateCode = roundId.split('-')[0]

      return prefix + stateCode.toLowerCase()
    }
  })
