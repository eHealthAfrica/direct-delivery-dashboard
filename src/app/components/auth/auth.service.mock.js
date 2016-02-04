'use strict';

(function (angular) {

  angular.module('authServiceMock', [])
    .service('authService', function ($q) {
      this.getUserSelectedState = function () {
        return $q.when('State1')
      }
    })
})(angular)