'use strict';
// AngularJS will instantiate a singleton by calling "new" on this function
angular.module('lmisApp')
  .service('utility', function utility($filter, $q, $http) {
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
      var lastDayOfCurrentWeek = firstDayOfCurrentWeek + FIRST_DAY_AND_LAST_DAY_DIFF;

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

    this.request = function request(url, params) {
      var d = $q.defer();

      $http.get(url, {params: params || {}})
        .success(function(data) {
          d.resolve(data);
        })
        .error(function(err) {
          console.log(err);
          d.reject(err);
        });

      return d.promise;
    };

    this.stringComparator = function stringComparator(actual, expected) {
      return (actual.toLowerCase().indexOf(expected.toLowerCase()) >= 0);
    };

    this.objectComparator = function objectComparator(actual, expected) {
      var matches = true;
      Object.keys(expected).some(function(key) {
        if (actual[key] === undefined || actual[key].toLowerCase().indexOf(expected[key].toLowerCase()) < 0) {
          matches = false;
          return true;
        }

        return false;
      });

      return matches;
    };

    this.comparator = function comparator(actual, expected) {
      if (angular.isString(actual) && angular.isString(expected))
        return this.stringComparator(actual, expected);
      else if (angular.isObject(actual) && angular.isObject(expected))
        return this.objectComparator(actual, expected);
      else
        return (actual == expected);
    }.bind(this);

    this.placeDateFilter = function placeDateFilter(rows, placeType, placeSearch, dateFrom, dateTo) {
      placeSearch = placeSearch.toLowerCase();

      return rows.filter(function(row) {
        var date = moment(row.created);
        var include = true;

        if (include && placeSearch && placeType)
          include = include && (row.facility[placeType].toLowerCase() === placeSearch);

        if (include && dateFrom)
          include = include && (date.isSame(dateFrom, 'day') || date.isAfter(dateFrom));

        if (include && dateTo)
          include = include && (date.isSame(dateTo, 'day') || date.isBefore(dateTo));

        return include;
      });
    };

    this.processRemoteErrors = function(form, err) {
      if (err.status == 400) {
        var errors = {};
        for (var prop in err.data.errors) {
          var formProp = prop.replace(/\./g, '_');
          if (form[prop]) {
            var msg = '';
            switch (err.data.errors[prop]) {
              case 'required':
              case 'invalid':
                msg = err.data.errors[prop];
                break;
              case 'unique':
                msg = 'already used';
                break;
            }

            if (msg) {
              form[formProp].$setValidity('remote', false);
              errors[formProp] = msg;
            }
          }
        }

        return errors;
      }
      else if (err.status == 0)
        return {_: 'Failed to connect to server.'}
      else
        return {_: JSON.stringify(err)};
    }
  });
