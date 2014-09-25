'use strict';

angular.module('lmisApp')
  .controller('LoginCtrl', function($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};
    $scope.busy = false;

    $scope.login = function(form) {
      $scope.errors.other = null;
      $scope.submitted = true;

      if (form.$valid) {
        $scope.busy = true;

        Auth
          .login({
            username: $scope.user.username,
            password: $scope.user.password
          })
          .then(function() {
            // Logged in, redirect to home
            $location.path('/');
          })
          .catch(function(err) {
            $scope.errors.other = err.message;
          })
          .finally(function() {
            $scope.busy = false;
          });
      }
    };

  });
