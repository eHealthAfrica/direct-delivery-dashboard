'use strict'

angular.module('configurations.locations')
  .controller('ConfigurationsLocationsLgasCtrl', function(locationService, log){
		var vm = this;
		vm.states = [];
    vm.zones  = []
		vm.csv ={
			separator: ',',
			header: true
		}
		vm.canSave = false;
		 
		locationService.getLocationsByLevel('2')
			.then(function(response){
				vm.states = response;
			})
	 vm.getZones = function(state){
    
     var keys = [];
     keys.push(['3', JSON.parse(state)._id]);
     return locationService.getByLevelAndAncestor(keys)
      .then(function(response){
        console.log(response)
        vm.zones = response;
      })
   }
		vm.finished = function (data) {
      if (data) {
        vm.canSave = true;
      }
    }

    vm.save = function () {
      var locations = []
      var results = vm.csv.result
      for (var i in results) {
        if(results[i].name){
          var l = {
            name: results[i].name,
            _id: results[i].id,
            osmId: results[i].osmId,
            'ISO3166-2': results[i]['ISO3166-2'],
            ancestors: [
              results[i].admin_level_0,
              results[i].admin_level_1,
              results[i].admin_level_2,
              JSON.parse(vm.zone)._id,
              results[i].admin_level_4
            ],
            doc_type: 'location',
            level: results[i].level
          }
          l._id = (l.ancestors.join('-') + l.name.replace(' ', '_')).toUpperCase();
          locations.push(l)
        }else{
					return log.error('InvalidFileImport', {})
				}
      }
      return locationService.saveMany(locations)
        .then(function (response) {
          log.success('locationSaveSuccess', response);
          return response;
        })
        .catch(function (err) {
          log.error('locationSaveErr', err)
        })
		}

	})