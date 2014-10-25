'use strict';

angular.module('lmisApp')
  .controller('UsersCtrl', function(states, zones, lgas, wards, users) {
    this.viewState = 'list';
    this.states = states.sort();
    this.zones = zones.sort();
    this.lgas = lgas.sort();
    this.wards = wards.sort();
    this.users = users;
  })
  .controller('CreateUserCtrl', function($scope, User, Alerts) {
    this.user = {
      name: '',
      password: '',
      access: {
        level: '',
        items: []
      },
      save: function() {
        return User.save({}, {
          name: this.name,
          password: this.password,
          access: this.access
        }).$promise
          .then(function(user) {
            $scope.main.users.push(user);
            Alerts.success('User created');
          });
      }
    };
  })
  .controller('UserFormCtrl', function($scope, utility) {
    this.saving = false;
    this.accessItems = [];

    this.selectedAccessLevel = function selectedAccessLevel(level) {
      this.user.access.items = [];

      switch (level) {
        case 'state':
          this.accessItems = $scope.main.states;
          break;
        case 'zone':
          this.accessItems = $scope.main.zones;
          break;
        case 'lga':
          this.accessItems = $scope.main.lgas;
          break;
        case 'ward':
          this.accessItems = $scope.main.wards;
          break;
        default:
          this.accessItems = [];
      }
    };

    this.submit = function submit(form) {
      this.errors = null;
      this.submitted = true;

      if (form.$valid) {
        this.saving = true;
        this.user.save()
          .then(function() {
            $scope.main.viewState = 'list';
          })
          .catch(function(err) {
            this.errors = utility.processRemoteErrors(form, err);
          }.bind(this))
          .finally(function() {
            this.saving = false;
          }.bind(this));
      }
    };
  });