'use strict'

angular.module('users')
  .controller('UsersFormCtrl', function ($scope, $state, log, usersService, users, type, model) {
    var vm = this
    vm.type = type
    vm.title = type === 'update' ? 'Update User' : 'Create User'
    vm.submitLabel = type === 'update' ? 'Save' : 'Create'
    vm.submitted = false
    vm.user = angular.copy(model)
    vm.user.enabled = !!model.account

    usersService.getStates()
      .then(function (response) {
        vm.states = response
      })

    vm.save = function (form) {
      vm.submitted = true

      if (form.$valid) {
        vm.user.profile._id = vm.user.profile.email
        vm.user.profile.doc_type = 'driver'
        vm.user.profile.version = '1.0.0'

        usersService.saveProfile(vm.user.profile)
          .then(function (profile) {
            model.profile = angular.copy(profile)
          })
          .then(function () {
            if (vm.user.enabled) {
              if (!vm.user.account.password) {
                return
              }

              vm.user.account._id = 'org.couchdb.user:' + vm.user.profile._id
              vm.user.account.name = vm.user.profile._id
              vm.user.account.roles = vm.user.account.roles || []

              return usersService.saveAccount(vm.user.account)
                .then(function (account) {
                  delete account.password
                  model.account = angular.copy(account)
                })
            } else if (vm.user.account && vm.user.account._id) {
              return usersService.removeAccount(vm.user.account)
                .then(function () {
                  vm.user.account = null
                  model.account = null
                })
            }
          })
          .then(function () {
            if (type === 'update') {
              log.success('userUpdated')
            } else {
              users.push(model)
              log.success('userCreated')
            }

            $state.go('users.all')
          })
          .catch(function (err) {
            if (err.name === 'conflict') {
              log.error('userExists')
            } else {
              log.error('unknownError', err)
            }
          })
      }
    }
  })
