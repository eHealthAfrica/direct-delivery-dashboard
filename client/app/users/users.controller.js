'use strict';

angular.module('lmisApp')
  .controller('UsersCtrl', function(states, zones, lgas, wards, users) {
    this.viewState = 'list';
    this.states = states;
    this.zones = zones;
    this.lgas = lgas;
    this.wards = wards;
    this.users = users;
  })
  .controller('CreateUserCtrl', function($scope, User) {
    this.user = {
      name: '',
      password: '',
      access: {
        level: '',
        items: []
      }
    };

    this.create = function create(form) {
      this.errors = null;
      this.submitted = true;

      if (form.$valid) {
        User.save({}, this.user).$promise
          .then(function(res) {
            $scope.usersCtrl.users.push(res);
            $scope.usersCtrl.viewState = 'list';
          })
          .catch(function(err) {
            console.error(err);
            this.errors = err.data.errors || err.data;
          }.bind(this));
      }
    };
  });