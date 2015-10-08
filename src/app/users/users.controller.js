'use strict'

angular.module('users')
  .controller('UsersCtrl', function (users) {
    var vm = this
    vm.users = users
  })
