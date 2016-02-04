'use strict';

(function (angular) {
  angular.module('authServiceMock', [])
    .service('authService', function ($q) {
      this.getUserSelectedState = function () {
        return $q.when('State1')
      }

      this.getCurrentUser = function () {
        return $q.when({
          '_id': 'org.couchdb.user:a@a.org',
          '_rev': '2-9a147d80ed76d038daa4e37933538c72',
          'password_scheme': 'pbkdf2',
          'iterations': 10,
          'name': 'a@a.org',
          'roles': [
            'driver',
            'dd_user'
          ],
          'type': 'user',
          'derived_key': 'bc7223d41bd466f2e6b7c39f3f67c539262252bc',
          'salt': '96e30899e018808d9288eae337a0fdea'
        })
      }
    })
}(angular))
