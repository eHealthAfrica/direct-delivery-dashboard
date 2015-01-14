'use strict';

(function() {
  function AuthService($rootScope, $window, $log, $q, pouchDB, config) {
    var initialized = false;
    var currentUser = null;

    // properties
    Object.defineProperty(this, 'initialized', {
      get: function() {
        return initialized;
      }
    });

    Object.defineProperty(this, 'currentUser', {
      get: function() {
        return currentUser;
      }
    });

    Object.defineProperty(this, 'isLoggedIn', {
      get: function() {
        return !!currentUser;
      }
    });

    // methods
    this.init = function() {
      if (initialized) {
        var deferred = $q.defer();
        deferred.resolve(this.currentUser);

        return deferred.promise;
      }

      var db = new pouchDB(config.db);

      return db.getSession()
        .then(function(response) {
          if (!response.userCtx.name) {
            // nobody's logged in
            return null;
          }

          return db.getUser(response.userCtx.name);
        })
        .then(function(response) {
          initialized = true;
          this.setCurrentUser(response);

          return this.currentUser;
        }.bind(this))
        .catch(function(err) {
          initialized = true;
          $log.warn(err);
          throw 'networkError';
        });
    };

    this.setCurrentUser = function(user) {
      if (user !== currentUser) {
        currentUser = user ? $window._.pick(user, ['_id', '_rev', 'name', 'roles']) : null;

        $rootScope.$emit('currentUserChanged', user);
      }
    };

    this.login = function(username, password) {
      if (!username || !password) {
        return $q.reject('authInvalid');
      }

      var db = new pouchDB(config.db);

      return db.login(username, password)
        .then(function() {
          return db.getUser(username);
        })
        .then(function(response) {
          this.setCurrentUser(response);

          return currentUser;
        }.bind(this))
        .catch(function(err) {
          throw err.name === 'unauthorized' ? 'authInvalid' : 'networkError';
        });
    };

    this.logout = function() {
      var db = new pouchDB(config.db);

      return db.logout()
        .catch(function(err) {
          $log.warn('Failed to logout from server.');
          $log.warn(err);
        })
        .then(function() {
          this.setCurrentUser(null);
        }.bind(this));
    };
  }

  angular.module('auth').service('AuthService', AuthService);
}());
