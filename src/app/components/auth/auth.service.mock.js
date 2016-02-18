'use strict';

(function (angular) {
  function getUserData () {
    return {
      '_id': 'org.couchdb.user:a@a.org',
      'password_scheme': 'pbkdf2',
      'name': 'a@a.org',
      'roles': [
        'driver',
        'dd_user',
        'direct_delivery_dashboard_state_kn'
      ],
      userCtx: {
        name: 'a@a.org'
      },
      'type': 'user',
      'derived_key': 'KEY',
      'salt': 'salt',
      isAdmin: function () {
        return true
      },
      hasRole: function (roles) {
        roles = angular.isArray(roles) ? roles : []
        return this.roles.filter(function (role) {
          return roles.indexOf(role) !== -1
        }).length > 0
      }
    }
  }

  angular.module('authServiceMock', [])
    .service('authService', function ($q) {
      this.getUserSelectedState = function () {
        return $q.when('State1')
      }
      this.authorisedStates = function () {
        return $q.when(['KN', 'BA'])
      }
      this.getCurrentUser = function () {
        return $q.when(getUserData())
      }
    })

  angular.module('ehaCouchDbAuthServiceMock', [])
    .service('ehaCouchDbAuthService', function ($q) {
      var self = this
      self.userData = getUserData()

      this.signIn = function (username, password) {
        var user = 'user'
        var pass = 'pass'
        if (username === user && password === pass) {
          return $q.when(getUserData())
        }
        return $q.reject({message: 'failed'})
      }

      this.getCurrentUser = function () {
        return $q.when(getUserData())
      }

      this.requireUserWithRoles = function (roles) {
        return function () {
          var user = self.userData
          if (!user.hasRole(roles) && !user.isAdmin()) {
            return $q.reject('unauthorized')
          }
          return $q.when(user)
        }
      }
    })
}(angular))
