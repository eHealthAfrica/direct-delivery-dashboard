angular.module('allocations')
	.controller('AllocationValuesController', function (data, assumptionService, log) {
		var vm = this

		vm.allocationTemp = data

		vm.update = function () {
			assumptionService.save(data)
				.then(function (data) {
					return log.success('assumptionEdited', data)
				})
				.catch(function (err) {
					if (err.status === '409') {
						log.error('updateConflict', err)
					} else {
						log.error('unknownError', err)
					}
				})
		}
	})
