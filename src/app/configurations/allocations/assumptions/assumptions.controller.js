/**
 * Created by ehealthafrica on 7/7/15.
 */
angular.module('allocations')
  .controller('AssumptionsCtrl', function (assumptionList, assumptionAddService, assumptionService) {
    var vm = this
    vm.assumptionList = assumptionList
    vm.docTypes = assumptionService.DOC_TYPES

    vm.editTemplate = function (template) {
      assumptionAddService.openForm(template, template.doc_type)
    }

    vm.createNewTemplate = function (templateType) {
      return assumptionAddService.openForm(null, templateType)
    }

    vm.showTable = function () {
      return vm.assumptionList.length > 0
    }

  })
