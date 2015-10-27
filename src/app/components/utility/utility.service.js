'use strict'

/**
 * @name utility
 * @desc for sharing common functions and service
 */
angular.module('utility')
  .service('utility', function ($filter, config) {
    this.formatDate = function (date, format) {
      var dateFormat = format || config.dateFormat
      return $filter('date')(new Date(date), dateFormat)
    }

    this.takeFirst = function (list) {
      return list[0]
    }

    /**
     * This takes a date object, extract only "yyyy-MM-dd" part
     * and return it as date object.
     *
     * Needed to set HTML 5 date input field in AngularJS.
     * see https://docs.angularjs.org/api/ng/input/input%5Bdate%5D
     */
    this.extractDate = function (date) {
      return new Date(this.formatDate(date))
    }

    /**
     * We use this because angular.isDate() returns True if given a date
     * that is invalid. e.g angular.isDate(undefined)
     * @param date
     * @returns {boolean}
     */
    this.isValidDate = function (date) {
      return (date && date !== null && (new Date(date)).toString() !== 'Invalid Date')
    }

    this.isEmptyObject = function (obj) {
      return angular.isObject(obj) && Object.keys(obj).length === 0
    }

    this.contains = function (str, subStr) {
      return str.indexOf(subStr) !== -1
    }

    this.capitalize = function (str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    }

    this.hashBy = function (list, key) {
      var hash = {}
      list.forEach(function (elem) {
        var id = elem[key]
        hash[id] = elem
      })
      return hash
    }

    // Useful when writing in a functional style
    this.returnEmptyList = function () {
      return []
    }
    this.escapeRegExp = function escapeRegExp (string) {
      return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
    }
    this.replaceAll = function (string, find, replace) {
      return string.replace(new RegExp(this.escapeRegExp(find), 'g'), replace)
    }
  })
