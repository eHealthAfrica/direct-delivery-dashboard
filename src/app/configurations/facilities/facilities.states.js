angular.module('configurations.facilities')
  .config(function ($stateProvider) {
    $stateProvider.state('configurations.facilities', {
      parent: 'configurations.layout',
      url: '/facilities',
      templateUrl: 'app/configurations/facilities/layout.html',
      controller: 'FacilitiesCtrl as facilitiesCtrl',
    })
      .state('configurations.facilities.list', {
        parent: 'configurations.facilities',
        url: '/list',
        controller: 'ConfigFacilityListCtrl as configFacilityListCtrl',
        templateUrl: 'app/configurations/facilities/list/list.html',
        resolve: {
          states: function (locationService) {
            return locationService.getLocationsByLevel('2')
              .catch(function () {
                return []
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
