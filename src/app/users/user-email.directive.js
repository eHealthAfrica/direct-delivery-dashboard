'use strict'

angular.module('users')
  .directive('userEmail', function ($q, usersService) {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$asyncValidators.userEmail = function (modelValue, viewValue) {
          var validate = !attrs.userEmail || !!scope.$eval(attrs.userEmail)

          // consider empty model valid
          if (!validate || ctrl.$isEmpty(modelValue)) {
            return $q.when()
          }

          var deferred = $q.defer()

          usersService.get(modelValue)
            .then(function () {
              deferred.reject()
            })
            .catch(function (err) {
              if (err.status !== 404) {
                console.log(err)
              }

              deferred.resolve()
            })

          return deferred.promise
        }
      }
    }
  })
