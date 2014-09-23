'use strict';

angular.module('lmisApp')
  .factory('Auth', function Auth($rootScope, couchdb) {
    $rootScope.currentUser = null;
    $rootScope.app = $rootScope.app || {
      init: false
    };

    // Get current user
    /*
    couchdb.session().$promise
      .then(function (data) {
        set((data.userCtx && data.userCtx.name) ? data.userCtx : null);
      })
      .catch(function (err) {
        console.log(err);
        set(null);
      })
      .finally(function () {
        $rootScope.app.init = true;
      });
    */

    // use fake user for demo purposes until new auth is implemented
    set({ name: 'Rabiu' });
    $rootScope.app.init = true;

    function set(user) {
      if (user != $rootScope.currentUser)
      {
        $rootScope.currentUser = user;
        $rootScope.$emit('currentUserChanged', user);
      }
    }

    return {

      /**
       * Authenticate user
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function (user, callback) {
        var cb = callback || angular.noop;

        var promise = couchdb.login({
          name: user.username,
          password: user.password
        }).$promise;

        promise
          .then(function (data) {
            if (data.ok) {
              set({
                name: user.username,
                roles: data.roles
              });
            }
            cb();
          })
          .catch(function (err) {
            cb(err);
          });

        return promise;
      },

      /**
       * Unauthenticate user
       *
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      logout: function (callback) {
        var cb = callback || angular.noop;

        var promise = couchdb.logout().$promise;
        promise
          .then(function (data) {
            if (data.ok)
              set(null);

            cb();
          })
          .catch(function (err) {
            cb(err);
          });

        return promise;
      },

      /**
       * Returns current user
       *
       * @return {Object} user
       */
      currentUser: function () {
        return $rootScope.currentUser;
      },

      /**
       * Simple check to see if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function () {
        return !!$rootScope.currentUser;
      }
    };
  });