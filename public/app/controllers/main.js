'use strict';

angular.module('lmisDashboardApp').controller('main', function($scope, database) {

    $scope.docs = [];

    $scope.init = function() {
        database.loadData().then(function(docs) {
            var productProfiles = []
            var data = docs;
            var selectedColumns = [];

            // build product profiles array (set of table headings)
            for (var index in data) {
                if(data[index].unopened){
                    for(var item in data[index].unopened) {
                        if(productProfiles.indexOf(item) === -1){
                            productProfiles.push(item);
                        }
                    }
                }
            }
            for (var index in data) {
                var objSet = {}
                if(data[index].facility){
                    objSet.facility = data[index].facility;
                }
                if (data[index].countDate) {
                    objSet.countDate = data[index].countDate;
                }
                objSet.productProfiles = [];
                if(data[index].unopened) {
                    for(var item in productProfiles) {
                        var objProfile = {}
                        if(data[index].unopened[productProfiles[item]] !== undefined) {
                            objProfile.profile = productProfiles[item];
                            objProfile.count = data[index].unopened[productProfiles[item]];
                       
                        } else {
                            objProfile.profile = productProfiles[item];
                            objProfile.count = '';
                        }
                        objSet.productProfiles.push(objProfile);
                    }
                }
                selectedColumns[index] = objSet
            }
            console.log(selectedColumns);
            $scope.docs = selectedColumns;
        });   
    };
    $scope.init();



});