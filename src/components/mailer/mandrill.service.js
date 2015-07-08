'use strict';

angular.module('mailer')
		.service('mandrillService', function($http) {

			function EMail() {

				var self = this;
				self.to = [];

				this.setHTML = function(html) {
					self.html = html;
				};

				this.setText = function(msgBody){
					self.text = msgBody;
				};

				this.setSubject = function(subject) {
					self.subject = subject;
				};

				this.setSender = function(email, name) {
					self.from_email = email;
					self.from_name = name;
				};

				this.addRecipients = function(recipients) {
					self.to = self.to.concat(recipients);
				};

				this.addRecipient = function(recipient) {
					self.to.push(recipient);
				};

			}

			var config = {};

			this.setConfig = function(cfg) {
				config = cfg;
			};

			this.getConfig = function() {
				return config;
			};

			this.Email = function() {
				return new EMail();
			};

			/**
			 * Sample msg object
			 *
			 * var msg = {
			 *			"html": "<p>HTML email body</p>",
			 *			"text": "Email text body not required if you use html and will be overridden if you specify html",
			 *			"subject": "Email Subject",
			 *			"from_email": "Sender email",
			 *			"from_name": "Sender's name",
			 *			"to": [
			 *				{
			 *					"email": "recipient@recipient.com",
			 *					"name": "Recipient Name",
			 *					"type": "to"
			 *				}
			 *			]
			 *	};
			 *
			 *
			 * @see https://mandrillapp.com/api/docs/messages.JSON.html for complete Mandrill API
			 * documentation
			 *
			 * @param msg
			 * @returns {*}
			 */
			this.send = function(msg) {
				var reqData = {
					"key": config.apiKey,
					"message": msg
				};

				var reqOptions = {
					method: 'POST',
					url: config.apiUrl,
					data: reqData
				};
				return $http(reqOptions);
			};

		});
