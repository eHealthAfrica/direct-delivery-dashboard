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
        .then(function (r) {
          log.success('assumptionSaved', data)
        })
        .catch(function (err) {
          log.error('assumptionSaveFailed', err)
        })
    }

    vm.createNewTemplate = function (templateType) {
      var modalInstance = assumptionAddService.openForm(null, templateType)
        .then(function (r) {
          log.success('assumptionSaved', data)
        })
        .catch(function (err) {
          log.error('assumptionSaveFailed', err)
        })
    }

    vm.showTable = function () {
      return vm.assumptionList.length > 0
    }
  })
