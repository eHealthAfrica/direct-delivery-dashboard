'use strict'

angular.module('users')
  .controller('UsersAllCtrl', function (log, usersService) {
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
      .catch(function (reason) {
        log.error('locationLoadErr')
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
        .catch(function (reason) {
          log.error('userLoadErr')
        })
    }

    vm.remove = function (user) {
      usersService.remove(user)
        .then(function () {
          vm.getUsers()
          log.success('userRemoved')
        })
        .catch(function (err) {
          log.error('unknownError', err)
        })
    }

    vm.getUsers()
  })
