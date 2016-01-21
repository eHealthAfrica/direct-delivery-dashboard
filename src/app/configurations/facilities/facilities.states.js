angular.module('configurations.facilities')
  .config(function ($stateProvider) {
    $stateProvider.state('configurations.facilities', {
      parent: 'configurations.layout',
      url: '/facilities',
      templateUrl: 'app/configurations/facilities/layout.html',
      controller: 'FacilitiesCtrl as facilitiesCtrl'
    })
      .state('configurations.facilities.list', {
        parent: 'configurations.facilities',
        url: '/list',
        controller: 'ConfigFacilityListCtrl as configFacilityListCtrl',
        templateUrl: 'app/configurations/facilities/list/list.html',
        resolve: {
          states: function (authService) {
            return authService.getUserStates()
              .catch(function () {
                return []
              })
          },
          selectedStateId: function (authService) {
            return authService.getUserSelectedState(true)
              .catch(function () {
                return {}
              })
          }
        }
      })
      .state('configurations.facilities.uploader', {
        parent: 'configurations.facilities',
        url: '/upload',
        controller: 'FacilityUploadCtrl as facilityUploadCtrl',
        templateUrl: 'app/configurations/facilities/upload/upload.html'
      })
  })
