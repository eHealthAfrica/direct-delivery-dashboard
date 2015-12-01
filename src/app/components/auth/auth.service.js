'use strict'

angular.module('auth')
  .service('authService', function (
    $q,
    $state,
    log,
    config,
    navbarService,
    ehaCouchDbAuthService,
    $localForage,
    locationService
  ) {
    var self = this
    self.stateMap = {states: [], selectedState: ''}

    self.getCurrentUser = ehaCouchDbAuthService.getCurrentUser

    self.login = function (username, password) {
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
        .then(self.loadStatesForCurrentUser.bind(null))
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

    function roundToStateRole (roundId) {
      // TODO: get this from role lib
      var prefix = 'direct_delivery_dashboard_state_'
      // TODO: make this more robust
      var stateCode = roundId.split('-')[0]
      return prefix + stateCode.toLowerCase()
    }

    self.requireStateRole = function (roundId, authProvider) {
      var role = roundToStateRole(roundId)
      if (!role) {
        return $q.reject('Could not determine state role from round')
      }
      var authFun = authProvider.requireUserWithRoles([role])
      return authFun(ehaCouchDbAuthService, $q)
    }

    function initializeStateVariables () {
      $localForage.removeItem(['selectedState', 'states'])
        .finally(function () {
          self.stateMap.states = []
          self.stateMap.selectedState = ''
        })
    }

    self.getUserSelectedState = function (byId) {
      return self.getCurrentUser()
        .then(function (user) {
          if (!user.userCtx.name) {
            return ''
          }
          return $localForage.getItem('selectedState')
            .then(function (state) {
              var result = !byId ? state : (byId === true ? self.getState(state, true) : self.getState(state))
              return $q.when(result)
            })
        })
    }

    self.setUserSelectedState = function (state) {
      return self.getCurrentUser()
        .then(function (user) {
          if (!state || !user.userCtx.name) {
            return $q.when('')
          }
          return $localForage.setItem('selectedState', state)
            .then(function (st) {
              return true
            })
        })
    }

    self.getState = function (name, byId) {
      return $localForage.getItem('states')
        .then(function (states) {
          if (!name || !states || !states.length) {
            return ''
          }
          var state = states.filter(function (item) {
            return item.name === name
          })[0]
          return byId ? state._id : state
        })
    }

    self.getUserStates = function () {
      function getStatesByUser (user) {
        var LEVEL = '2'
        if (user.isAdmin()) {
          return locationService.getLocationsByLevel(LEVEL)
        }
        var stateIds = self.authorisedStates(user)
        return locationService.getLocationsByLevelAndId(LEVEL, stateIds)
      }

      return self.getCurrentUser().then(getStatesByUser)
    }

    self.authorisedStates = function (user) {
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

    self.loadStatesForCurrentUser = function () {
      return self.getCurrentUser()
        .then(function () {
          return self.getUserStates()
        })
        .then(function (userStates) {
          // self.stateMap.statesArray = userStates
          $localForage.setItem('states', userStates)
          self.stateMap.states = userStates.map(function (item) {
            return item.name
          })
          // check if localstorage has the item first
          // if it doesnt have and you can, then add it
          $localForage.getItem('selectedState')
            .then(function (result) {
              if (!result && self.stateMap.states.length) {
                self.stateMap.selectedState = self.stateMap.states[0]
                $localForage.setItem('selectedState', self.stateMap.states[0])
                  .then(function (state) {
                    self.stateMap.selectedState = state
                  })
              } else {
                self.stateMap.selectedState = result
              }
            })
        })
        .catch(function () {
          initializeStateVariables()
        })
    }

    self.clearStatesForUser = function () {
      initializeStateVariables()
    }
  })
