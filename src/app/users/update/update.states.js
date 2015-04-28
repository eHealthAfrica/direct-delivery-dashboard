'use strict';

angular.module('users')
  .config(function($stateProvider) {
    $stateProvider.state('users.update', {
      url: '/update/:id',
      templateUrl: 'app/users/form/form.html',
      controller: 'UsersFormCtrl',
      controllerAs: 'usersFormCtrl',
      resolve: {
        type: function() {
          return 'update';
        },
        model: function($state, $stateParams, log, users) {
          var model = null;

          for (var i=0; i < users.length; i++) {
            var user = users[i];
            if (user.profile._id == $stateParams.id) {
              model = user;
              break;
            }
          }

          if (model) {
            return model;
          }
          else {
            log.error('invalidUserId');
            $state.go('users.all');
          }
        }
      }
    });
  });
