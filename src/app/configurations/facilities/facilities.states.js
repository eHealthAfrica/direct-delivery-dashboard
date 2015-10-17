angular.module('configurations.facilities')
  .config(function ($stateProvider) {
    $stateProvider.state('configurations.facilities', {
      parent: 'configurations.layout',
      url: '/facilities',
      templateUrl: 'app/configurations/facilities/layout.html',
      controller: 'FacilitiesCtrl as facilitiesCtrl',
      resolve: {
        states: function (locationService) {
          return locationService.getLocationsByLevel('2')
            .catch(function () {
              return []
            })
        }
      }
    })
  })
