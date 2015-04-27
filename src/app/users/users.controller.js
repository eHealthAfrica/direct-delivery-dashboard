'use strict';

angular.module('users')
  .controller('UsersCtrl', function(users) {
    var vm = this;
    vm.users = [];

    angular.forEach(users, function(user) {
      vm.users.push(user);
    });
  });
