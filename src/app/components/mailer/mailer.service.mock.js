'use strict'

angular.module('mailerServiceMock', [])
  .factory('mailerService', function ($q) {
    return {
      setConfig: function (cfg) {
        return $q.when(cfg)
      },
      getConfig: function (cfg) {
        return $q.when(cfg)
      },
      send: function (email) {
        return $q.when(email)
      },
      Email: function () {
        return {
          setSender: function (email, name) {
            return email + name
          },
          setSubject: function (subject) {
            return subject
          },
          setHTML: function (msg) {
            return msg
          },
          addRecipients: function (emails) {
            return emails
          }
        }
      }
    }
  })

