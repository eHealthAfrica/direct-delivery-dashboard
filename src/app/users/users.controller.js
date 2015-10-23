'use strict'

angular.module('users')
  .controller('UsersCtrl', function (log, usersService, users) {
    var vm = this
    vm.statesObject = {}
    usersService.getStates()
      .then(function (response) {
        vm.states = response
        if (response.length > 0) {
          var i = response.length
          while (i--) {
            vm.statesObject[response[i]._id] = response[i].name
          }
        }
      })

    vm.getUsers = function () {
      usersService.all(vm.selectedState)
        .then(function (usersObj) {
          var users = []

          angular.forEach(usersObj, function (user) {
            users.push(user)
          })

          vm.allUsers = users
        })
    }

    vm.getUsers()
  })
