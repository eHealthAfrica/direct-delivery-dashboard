'use strict'

angular.module('allocations')
  .service('assumptionAddService', function ($modal, assumptionService, config) {
    this.openForm = function (data, templateType) {
      return $modal.open({
        animation: true,
        templateUrl: 'app/configurations/allocations/assumptions/assumption-template/new-template.html',
        controller: 'AssumptionsTemplateAddCtrl',
        controllerAs: 'tempAddCtrl',
        resolve: {
          data: function () {
            return data
          },
          products: function (productService) {
            return productService.getAll()
              .catch(function () {
                return []
              })
          },
          states: function (locationService) {
            return locationService.getLocationsByLevel(config.deliveryRoundAdminLevel)
              .catch(function () {
                return []
              })
          },
          templateType: function () {
            return templateType
          }
        }
      })
        .result
        .then(function (response) {
          return assumptionService.save(response)
            .then(function (r) {
              return angular.extend(r, response)
            })
        })
    }
  })
