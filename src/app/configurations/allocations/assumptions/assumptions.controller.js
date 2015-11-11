/**
 * Created by ehealthafrica on 7/7/15.
 */
angular.module('allocations')
  .controller('AssumptionsCtrl', function (assumptionList, assumptionAddService, assumptionService, log) {
    var vm = this
    vm.assumptionList = assumptionList
    vm.docTypes = assumptionService.DOC_TYPES

    vm.editTemplate = function (template) {
      var modalInstance = assumptionAddService.openForm(template, template.doc_type)
      modalInstance.result
        .then(function (formData) {
          assumptionService.save(formData)
            .then(function (data) {
              log.success('assumptionEdited', data)
              return assumptionService.getAll()
            })
            .then(function (data) {
              vm.assumptionList = data
            })
            .catch(function (err) {
              return log.error('assumptionSaveFailed', err)
            })
        })
        .catch(function (err) {
          log.info('canceledAssumptionEdit', err)
        })
    }

    vm.createNewTemplate = function (templateType) {
      var modalInstance = assumptionAddService.openForm(null, templateType)
      modalInstance.result
        .then(function (formData) {
          assumptionService.save(formData)
            .then(function (data) {
              log.success('assumptionSaved', data)
              return assumptionService.getAll()
            })
            .then(function (data) {
              vm.assumptionList = data
            })
            .catch(function (err) {
              return log.error('assumptionSaveFailed', err)
            })
        })
        .catch(function (err) {
          log.info('canceledAssumptionEdit', err)
        })
    }

    vm.showTable = function () {
      return vm.assumptionList.length > 0
    }
  })
