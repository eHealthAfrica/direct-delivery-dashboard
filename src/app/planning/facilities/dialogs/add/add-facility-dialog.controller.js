angular.module('planning')
		.controller('AddFacilityDialogCtrl', function($modalInstance, deliveryService, deliveryRound, locationService,
                                                  locationLevels, utility) {

			var vm = this;
			vm.deliveryRound = deliveryRound;
			vm.selectedLevel = '';
			vm.START_LEVEL = 3;
			vm.END_LEVEL = 5;
			vm.locationLevels = locationLevels;
			vm.selectionOpions = ['All', 'None'];
			vm.selectedIds = {};

			function fromLevel(locLevel) {
				return locLevel.level >= vm.START_LEVEL && locLevel.level <= vm.END_LEVEL;
			}

			//TODO: move to reusable utility function e.g sortBy(field, asc | desc)
			function sortBy(a, b){
				return a.level > b.level;
			}

			vm.selectedLocLevel = vm.locationLevels.filter(fromLevel).sort(sortBy);

			vm.cancel = function() {
				$modalInstance.dismiss('cancel');
			};

			vm.isSelected = function(id) {
				return vm.selectedIds[id] === true;
			};

			function selectAll(locations) {
				locations
						.forEach(function (loc) {
							vm.selectedIds[loc._id] = true;
						});
			}


			vm.onSelection = function(){
				vm.selectedlevelLocs = [];
				locationService.getLocationsByLevel(vm.selectedLevel)
						.then(function(locations){
							vm.selectedlevelLocs = locations;
							selectAll(vm.selectedlevelLocs);
						});
			};

			vm.onChecked = function(index) {
				vm.selectedlevelLocs[index].selected = !vm.selectedlevelLocs[index].selected;
			};

			vm.onSelectionOptions = function(selected) {
				if(selected === vm.selectionOpions[0]){
					selectAll(vm.selectedlevelLocs, true);
				}else if(selected === vm.selectionOpions[1]) {
					vm.selectedIds = {};
				}
			};

			vm.addToList = function() {
				if(utility.isEmptyObject(vm.selectedIds)) {
					return log.error('selectLevelToImportFromErr');
				}
				locationService.getBatch()
						.then(function(facilities) {
							$modalInstance.close(facilities);
						})
						.catch(log.error);

			};


		});