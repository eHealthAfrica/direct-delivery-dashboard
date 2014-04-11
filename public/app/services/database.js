'use strict';
angular.module('lmisDashboardApp').factory('database', function($resource, $q) {
    var resource = $resource('http://dev.lomis.ehealth.org.ng:5984/stockcount/:param',{param:'@param'});

    return {
        loadData: function() {
            var docs = [];
            var deferred = $q.defer();
            resource.get({param:'_all_docs', include_docs:'true'},
            function(data) {
                for (var i = 0; i < data.rows.length; i++) {
                    docs.push(data.rows[i].doc);
                }
                deferred.resolve(docs);
            },
            function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }
    }
});