'use strict';

angular.module('users')
  .controller('UsersFormCtrl', function($scope, $state, log, usersService, users, type, model) {
    var vm = this;
    vm.type = type;
    vm.title = type == 'update' ? 'Update User' : 'Create User';
    vm.submitLabel = type == 'update' ? 'Save' : 'Create';
    vm.submitted = false;
    vm.user = angular.copy(model);
    vm.user.enabled = !!model.account;

    vm.save = function(form) {
      vm.submitted = true;

      if (form.$valid) {
        vm.user.profile._id = vm.user.profile.email;
        vm.user.profile.doc_type = 'driver';
        vm.user.profile.version = '1.0.0';

        if (vm.user.enabled) {
          vm.user.account._id = 'org.couchdb.user:' + vm.user.profile._id;
          vm.user.account.name = vm.user.profile._id;
          vm.user.account.roles = [];
        }
        else
          vm.user.account = null;

        usersService.save(vm.user)
          .then(function(user) {
            if (user.account && user.account.password)
              delete user.account.password;

            angular.copy(user, model);

            if (type === 'update') {
              log.success('userUpdated');
              $state.go('users.all');
            }
            else {
              users.push(model);
              log.success('userCreated');
              $state.go('users.all');
            }
          })
          .catch(function(err) {
            if (err.name === 'conflict')
              log.error('userExists');
            else
              log.error('unknownError', err);
          });
      }
    }
  });
