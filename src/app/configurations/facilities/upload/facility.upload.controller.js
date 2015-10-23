angular.module('configurations.facilities')
	.controller('FacilityUploadCtrl', function(){
		var vm = this

    vm.csv = {
      header: true,
      separator: ','
    }
    vm.finished = function(result){
      console.log(result);
    }
	});