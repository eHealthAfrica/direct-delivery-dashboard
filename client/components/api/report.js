'use strict';

angular.module('lmisApp')
		.service('Report', function($rootScope, $http, $q) {

			var _this = this;

			var URL = '/api/report';
			var allPromise = null;

			$rootScope.$on('currentUserChanged', function() {
				allPromise = null;
			});

			_this.getWithin = function(startDate, endDate){
				return $http.get(URL)
						.then(function(res){
							console.log(res.data);
							return res.data;
						});
			};

		});
