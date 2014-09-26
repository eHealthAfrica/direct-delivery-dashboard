'use strict';

angular.module('lmisApp')
  .controller('NavbarCtrl', function ($scope, $location, $route, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $route.reload()
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });