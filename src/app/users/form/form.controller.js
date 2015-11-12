'use strict'

angular.module('users')
  .controller('UsersFormCtrl', function ($scope, $state, log, usersService, users, type, model, config, mailerService, $q, $location, driversService) {
    var vm = this
    vm.type = type
    vm.title = type === 'update' ? 'Update User' : 'Create User'
    vm.submitLabel = type === 'update' ? 'Save' : 'Create'
    vm.submitted = false
    vm.user = angular.copy(model)
    vm.user.enabled = !!model.account

    function generateMsg (user, password) {
      var deferred = $q.defer()
      var email = user.profile.email
      var forename = user.profile.forename
      var surname = user.profile.surname
      var state = user.profile.state
      var url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/'
      var link = '<a href="' + url + '">' + 'EHA Direct Delivery' + '</a>'

      driversService.getSignUpEmail()
        .then(function (template) {
          var subject = template.subject
          var msg = template.content.replace('{surname}', surname)
            .replace('{forename}', forename)
            .replace('{state}', state)
            .replace('{link}', link)
            .replace('{email}', email)
            .replace('{password}', password)
          deferred.resolve({msg: msg, subject: subject, email: email})
        })
      return deferred.promise
    }

    function createUserNotification (user, password) {
      var mailConfig = {
        apiUrl: config.mailerAPI,
        apiKey: config.apiKey
      }
      mailerService.setConfig(mailConfig)
      var email = mailerService.Email()
      email.setSender(config.senderEmail, config.senderName)

      return generateMsg(user, password)
        .then(function (result) {
          email.setSubject(result.subject)
          email.setHTML(result.msg)
          email.addRecipient(result.email)
          return email
        })
        .then(function (email) {
          return mailerService.send(email)
        }).catch(function () {
          log.error('notificationError', 'Error sending notification email')
        })
    }

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
                  var password = account.password
                  delete account.password
                  model.account = angular.copy(account)
                  return createUserNotification(vm.user, password)
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
