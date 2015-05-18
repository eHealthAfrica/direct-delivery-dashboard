'use strict';

angular.module('users')
  .controller('UsersAllCtrl', function(log, usersService, users) {
    var vm = this;

    vm.remove = function(user) {
      if (!confirm('Delete user ' + user.profile.forename + ' ' + user.profile.surname + '?'))
        return;

      usersService.remove(user)
        .then(function() {
          users.splice(users.indexOf(user), 1);
          log.success('userRemoved');
        })
        .catch(function(err) {
          log.error('unknownError', err);
        });
    };
  });
