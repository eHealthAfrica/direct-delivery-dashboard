'use strict'

angular.module('allocations')
  .service('assumptionAddService', function ($modal, log, assumptionService, config) {

    this.openForm = function (data, templateType) {
      var modalInstance = $modal.open({
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
      modalInstance.result
        .then(function (formData) {
          console.log(formData)
          assumptionService.save(formData)
            .then(function (data) {
              return log.success('assumptionEdited', data)
            })
            .catch(function (err) {
              return log.error('assumptionSaveFailed', err)
            })
        })
        .catch(function (err) {
          log.info('canceledAssumptionEdit', err)
        })
    }
  })
