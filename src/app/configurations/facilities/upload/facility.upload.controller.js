angular.module('configurations.facilities')
	.controller('FacilityUploadCtrl', function(log, locationService){
		var vm = this
    vm.csv = {
      header: true,
      separator: ','
    }
    vm.state
    vm.dataToSave = []
    var ancestorsFetched = false
    
    
    vm.canSave = false;
    vm.getStates = function(){
      locationService.getLocationsByLevel('2')
        .then(function(response){
          return vm.states = response;
        })
    }
    
    function _getAncestors(){
      var keys = [
        ['3', vm.state],
        ['4', vm.state],
        ['5', vm.state]
      ]
       return locationService.getByLevelAndAncestor(keys)
        .then(function(response){
          var p = 0;
          for(var i in vm.csv.result){
            var facility = vm.csv.result[i];
            facility.ancestor = ['NG', 'NW'];
            facility.ancestor.push(vm.state);
            for(var r in response){
              
              if(facility.zone.replace(' ', '-') === response[r].name.replace(' ', '-')){
                facility.ancestor.push(response[r]._id);
              }
              if(facility.lganame.replace(' ', '-') === response[r].name.replace(' ', '-')){
                facility.ancestor.push(response[r]._id);
              }
              if(facility.wardname.replace(' ', '-') === response[r].name.replace(' ', '-')){
                facility.ancestor.push(response[r]._id);
              }
            }
            
          }
          
        })
    }
    
    
    vm.getStates();
    
    vm.finished = function(result){
      if(result){
        if(!ancestorsFetched){
          _getAncestors()
            .then(function(){
              return 
            });
          ancestorsFetched = true;
          if(vm.state){
            vm.canSave = true
          }
        }else{
          console.warn('ancestors have been fetched')
        }
      }
    }
    
    vm.save = function(){
      
    }
	});