'use strict';

angular.module('mailer')
		.service('mailerService', function(mandrillService) {

			var config = {};

			this.setConfig = function(cfg) {
				config = cfg;
				mandrillService.setConfig(config);
			};

			this.getConfig = function() {
				return config;
			};

			this.Email = function() {
				return mandrillService.Email();
			};

			this.send = function(email) {
				return mandrillService.send(email);
			};

		});
