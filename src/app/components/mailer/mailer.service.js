'use strict'

/*

Sample Usage:

var mailConfig = {
  apiUrl: config.mailerAPI,
  apiKey: config.apiKey
}

mailerService.setConfig(mailConfig)
var email = mailerService.Email()
var subject = ['[VDD]', roundId, 'is ready to edit'].join(' ')
email.setSubject(subject)
email.setSender('no-reply@ehealthnigeria.org', 'EHA VDD')
email.setHTML(generateMsgBody(roundId))

var recipients = [
  {
    'email': 'recipient@example.com',
    'name': 'Recipient Name',
    'type': 'to'
  }
]
email.addRecipient(recipients)
return mailerService.send(email)
*/

angular.module('mailer')
  .service('mailerService', function (mandrillService) {
    var config = {}

    this.setConfig = function (cfg) {
      config = cfg
      mandrillService.setConfig(config)
    }

    this.getConfig = function () {
      return config
    }

    this.Email = function () {
      return mandrillService.Email()
    }

    this.send = function (email) {
      return mandrillService.send(email)
    }
  })
