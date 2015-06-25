'use strict';

/**
 * @name utility
 * @desc for sharing common functions and service
 */
angular.module('utility')
  .service('utility', function($filter, config) {

    this.formatDate = function(date, format) {
      var dateFormat = format || config.dateFormat;
      return $filter('date')(new Date(date), dateFormat);
    };

    /**
     * This takes a date object, extract only "yyyy-MM-dd" part
     * and return it as date object.
     *
     * Needed to set HTML 5 date input field in AngularJS.
     * see https://docs.angularjs.org/api/ng/input/input%5Bdate%5D
     */
    this.extractDate = function(date){
      return new Date(this.formatDate(date));
    };


      /**
       * We use this because angular.isDate() returns True if given a date
       * that is invalid. e.g angular.isDate(undefined);
       * @param date
       * @returns {boolean}
       */
    this.isValidDate = function(date){
      return (date && date !== null && (new Date(date)).toString() !== 'Invalid Date');
    };

    this.isEmptyObject = function(obj){
      return angular.isObject(obj) && Object.keys(obj).length === 0;
    };

  });
