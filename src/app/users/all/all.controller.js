'use strict'

angular.module('users')
  .controller('UsersAllCtrl', function (log, usersService, users) {
    var vm = this

    vm.remove = function (user) {
      usersService.remove(user)
        .then(function () {
          users.splice(users.indexOf(user), 1)
          log.success('userRemoved')
        })
        .catch(function (err) {
          log.error('unknownError', err)
        })
    }
  })
