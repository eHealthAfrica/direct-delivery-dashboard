'use strict';
// AngularJS will instantiate a singleton by calling "new" on this function
angular.module('lmisApp')
  .service('utility', function utility($filter) {
    this.castArrayToObject = function(array, key) {
      var newObject = {};
      key = angular.isUndefined(key) ? 'uuid' : key;
      if (angular.isArray(array)) {
        for (var i = 0; i < array.length; i++) {
          newObject[array[i][key]] = array[i];
        }
      }
      return newObject;
    };

    this.removeFromArray = function(needle, haystack) {
      if (angular.isArray(haystack)) {
        var index = haystack.indexOf(needle);
        return index !== -1 ? haystack.splice(index, 1) : haystack;
      }
      return haystack;
    };

    this.has = function(obj, key) {
      return obj != null && hasOwnProperty.call(obj, key);
    };

    this.getWeekRangeByDate = function(date, reminderDay) {
      var currentDate = date;
      // First day of current week is assumed to be Sunday, if current date is
      // 19-12-2014, which is Thursday = 4, then date of first day of current week
      // = 19 - 4 = 15-12-2014 which is Sunday
      var firstDayOfCurrentWeek = currentDate.getDate() - currentDate.getDay();
      var FIRST_DAY_AND_LAST_DAY_DIFF = 6;
      var lastDayOfCurrentWeek = firstDayOfCurrentWeek +
        FIRST_DAY_AND_LAST_DAY_DIFF;

      var firstDayDateOfCurrentWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        firstDayOfCurrentWeek, 0, 0, 0
      );

      var lastDayDateOfCurrentWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        lastDayOfCurrentWeek, 0, 0, 0
      );

      var reminderDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        firstDayOfCurrentWeek + reminderDay, 0, 0, 0
      );

      return {
        'first': firstDayDateOfCurrentWeek,
        'last': lastDayDateOfCurrentWeek,
        'reminderDate': reminderDate
      };

    };

    this.getFullDate = function(date) {
      //TODO: add validation for invalid date object.
      if (!angular.isDate(date)) {
        date = new Date(date);//create date object
      }
      return $filter('date')(date, 'yyyy-MM-dd');
    };

    this.getWeekDay = function(weekDayNumber) {
      var weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return angular.isDefined(weekDay[weekDayNumber]) ? weekDay[weekDayNumber] : null;
    };

    this.values = function(obj) {
      var values = [];
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          values.push(obj[key]);
        }
      }
      return values;
    };

    this.getFileName = function(prefix, ext) {
      prefix = (prefix || '').toLowerCase().replace(/ /g, '-');
      ext = ext || '.csv';
      var now = $filter('date')(new Date(), 'yyyy-MM-dd-HH-mm-ss');
      return prefix + '-' + now + ext;
    };

    this.isNotDesignDoc = function(doc) {
      return doc && doc._id && doc._id.substr(0, 7) !== '_design';
    };
  });
