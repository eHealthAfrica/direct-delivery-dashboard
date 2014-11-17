'use strict';

angular.module('lmisApp')
  .factory('Auth', function Auth($location, $rootScope, $http, $cookieStore, $q, Places, User) {
    var currentUser = {};

    if ($cookieStore.get('token')) {
      set(User.get());
    }

    $rootScope.$on('unauthorized', logout);

    function set(user) {
      if (user != currentUser) {
        currentUser = user;

        if (user.$promise)
        {
          user.$promise.finally(function() {
            setAccess();
          })
        }
        else
          setAccess();

        $rootScope.$emit('currentUserChanged', user);
      }
    }

    function setAccess() {
      currentUser.isAdmin = currentUser.roles && currentUser.roles.indexOf('admin') >= 0;

      currentUser.access = currentUser.access || {};
      currentUser.showStates = currentUser.isAdmin || currentUser.access.level === Places.STATE;
      currentUser.showZones = currentUser.showStates || currentUser.access.level === Places.ZONE;
      currentUser.showLgas = currentUser.showZones || currentUser.access.level === Places.LGA;
      currentUser.showWards = currentUser.showLgas || currentUser.access.level === Places.WARD;
    }

    function logout() {
      $cookieStore.remove('token');
      set({});
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http
          .post('/auth/local', {
            username: user.username,
            password: user.password
          }).
          success(function(data) {
            $cookieStore.put('token', data.token);
            set(User.get());
            deferred.resolve(data);
            return cb();
          }).
          error(function(err) {
            this.logout();
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: logout,

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('roles');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if (currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        }
        else if (currentUser.hasOwnProperty('roles')) {
          cb(true);
        }
        else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.isAdmin;
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
