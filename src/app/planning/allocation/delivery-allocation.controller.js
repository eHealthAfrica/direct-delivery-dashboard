angular.module('planning')
  .controller('DeliveryAllocationCtrl', function (
    deliveryRound,
    allocationTemplates,
    facilityAllocationInfo,
    deliveryAllocationService,
    log,
    calculationService,
    presentations) {

    var vm = this
    vm.views = {
      packedProduct: 'Packed Product',
      productPresentation: 'Product Presentation'
    }
    vm.selectedLGA = ''
    vm.productPresentation = {}

    vm.allocationTemplates = allocationTemplates
    vm.selectedAllocTemp = ''
    vm.presentations = presentations

    function initPresentations () {
      for (var ppId in vm.facAllocInfo.presentationsByProduct) {
        if (vm.facAllocInfo.presentationsByProduct.hasOwnProperty(ppId)) {
          var presentation = vm.facAllocInfo.presentationsByProduct[ppId]
          if (angular.isNumber(presentation)) {
            vm.productPresentation[ppId] = presentation
          }
        }
      }
    }

    vm.deliveryRound = deliveryRound
    vm.selectedView = vm.views.packedProduct
    vm.facAllocInfo = facilityAllocationInfo

    initPresentations()

    vm.isDisabled = function () {
      return vm.selectedView === vm.views.productPresentation
    }

    vm.switchView = function (view) {
      vm.selectedView = view
    }

    vm.hasNoAllocation = function () {
      return (vm.facAllocInfo.rows.length !== 0 &&
      vm.facAllocInfo.productList.length === 0)
    }

    vm.hasNoSchedule = function () {
      return vm.facAllocInfo.rows.length === 0
    }

    vm.hasProducts = function () {
      return vm.facAllocInfo.productList.length > 0
    }

    vm.updateList = function () {
      deliveryAllocationService.getAllocationBy(vm.deliveryRound._id, vm.selectedLGA)
        .then(function (result) {
          vm.facAllocInfo = result
        })
        .catch(vm.handleError)
    }

    vm.handleError = function (err) {
      log.error('getAllocationError', err)
    }

    vm.saveRow = function ($data, facRnd) {
      deliveryAllocationService.update(facRnd._id, facRnd.facility.id, $data)
        .then(function () {
          log.success('updateFacilityPackedQty')
        })
        .catch(deliveryAllocationService.onUpdateError)
    }

    vm.updatePresentation = function ($data, pCode) {
      if (vm.productPresentation[pCode] === $data[pCode]) {
        var msg = 'Same value, please select different value'
        log.info('', null, msg)
        return msg
      }
      return deliveryAllocationService.updatePackedPresentation(vm.deliveryRound._id, $data)
        .then(function (res) {
          var msg = [ pCode,
            'presentation updated to',
            $data[pCode],
            'successfully!'].join(' ')
          log.success('', res, msg)
          return true
        })
        .catch(function (err) {
          deliveryAllocationService.onUpdateError(err)
          return false
        })
    }

    vm.setAllocationTemplate = function (template) {
      if(!template || !angular.isObject(template.products)){
        return log.info('missingAllocTemplateProducts');
      }
      vm.selectedAllocTemp = template
      for(var pType in vm.selectedAllocTemp.products) {
        if (vm.facAllocInfo.productList.indexOf(pType) === -1) {
          vm.facAllocInfo.productList.push(pType)
        }
      }
      calculationService.setTemplate(vm.selectedAllocTemp)
      var facilities = vm.facAllocInfo.rows
        .map(function (row) {
          return { _id: row.facility.id }
        })

      calculationService.getMonthlyRequirement(facilities)
        .then(function (templates) {
          vm.facAllocInfo.rows = deliveryAllocationService.updateFromTemplate(vm.facAllocInfo.rows, templates)
        })
    }
  })
