'use strict'

angular.module('log')
  .service('log', function ($log, toastr, ERROR_MESSAGES, WARNING_MESSAGES, INFO_MESSAGES, SUCCESS_MESSAGES) {
    function log (key, type, collection, context, customMessage) {
      context = context || {}

      if (!angular.isObject(type)) {
        type = {
          log: type,
          toastr: type
        }
      }

      var message = collection[key] || {
        message: ''
      }

      var text = [
        message.message
      ]
      if (customMessage) {
        text.push(customMessage)
      }
      if (type.log === 'error' || type.log === 'warn') {
        text.push(message.remedy)
      }
      text = text.join('. ') + '.'

      $log[type.log](text, message, context)
      return toastr[type.toastr](text, message.title)
    }

    this.error = function (key, context, message) {
      return log(key, 'error', ERROR_MESSAGES, context, message)
    }

    this.warning = function (key, context, message) {
      var methods = {
        log: 'warn',
        toastr: 'warning'
      }
      return log(key, methods, WARNING_MESSAGES, context, message)
    }

    this.info = function (key, context, message) {
      return log(key, 'info', INFO_MESSAGES, context, message)
    }

    this.success = function (key, context, message) {
      var methods = {
        log: 'log',
        toastr: 'success'
      }
      return log(key, methods, SUCCESS_MESSAGES, context, message)
    }
  })
