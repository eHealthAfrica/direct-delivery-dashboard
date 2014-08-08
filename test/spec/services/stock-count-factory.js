'use strict';

describe('factory: stockCount', function () {
  beforeEach(module('lmisApp', 'appConfigMocks', 'stockCountMocks'));

  var stockCountFactory,
      stockCount,
      utility,
      appConfig;

  var fakeStockCount = [
    {
      'doc': {
        'facility': 'facility-1',
        'created': '2014-06-13T09:53:23.410Z',
        'countDate': '2014-06-08T23:00:00.000Z'
      }
    },
    {
      'doc': {
        'facility': 'facility-1',
        'countDate': '2014-06-08T23:00:00.000Z',
        'created': '2014-06-14T10:00:07.249Z'
      }
    },
    {
      'doc': {
        'facility': 'facility-2',
        'countDate': '2014-06-08T23:00:00.000Z',
        'created': '2014-06-13T21:46:21.380Z'
      }
    },
    {
      'doc': {
        'facility': 'facility-3',
        'countDate': '2014-07-03T23:00:00.000Z',
        'created': '2014-07-09T09:56:16.682Z'
      }
    }
  ];

  beforeEach(inject(function (_stockCount_, stockCountMock, appConfigMock, _utility_) {
    stockCountFactory = _stockCount_;
    stockCount = stockCountMock;
    appConfig = appConfigMock;
    utility = _utility_;
  }));

  describe('groupByFacility', function () {
    it('should group stockCount by facility uuid', function () {
      var groupedStockCount = stockCountFactory.groupByFacility(fakeStockCount);
      expect(toString.call(groupedStockCount)).toEqual('[object Object]');
      expect(groupedStockCount['facility-1'].length).toEqual(2);
    });
  });

  describe('getStockCountDueDate', function () {

    var DAILY = 1,
        WEEKLY = 7;

    it('should return today\'s date when called with DAILY interval.', function () {
      var today = utility.getFullDate(new Date());
      var reminderDay = 1;//Monday.
      var result = stockCountFactory.getStockCountDueDate(DAILY, reminderDay);
      var stockCountDueDate = utility.getFullDate(result);
      expect(today).toBe(stockCountDueDate);
    });

    it('should return expected count date when called with WEEKLY interval and reminder day.', function () {
      var today = new Date();
      var reminderDay = today.getDay();
      var expectedStockCountDate = utility.getFullDate(utility.getWeekRangeByDate(today, reminderDay).reminderDate);
      var result = stockCountFactory.getStockCountDueDate(WEEKLY, reminderDay);
      var stockCountDueDate = utility.getFullDate(result);
      expect(expectedStockCountDate).toBe(stockCountDueDate);
    });

    it('should return last week count date, if current week is not yet due.', function () {
      var today = new Date();
      var reminderDay = today.getDay() + 1;
      var aWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - WEEKLY);
      var expectedStockCountDate = utility.getFullDate(utility.getWeekRangeByDate(aWeekAgo, reminderDay).reminderDate);
      var result = stockCountFactory.getStockCountDueDate(WEEKLY, reminderDay);
      var stockCountDueDate = utility.getFullDate(result);
      expect(expectedStockCountDate).toBe(stockCountDueDate);
    });

  });

  describe('getDaysFromLastCountDate', function () {
    it('should return throw if date object is not provided', function () {
      expect(function () {stockCountFactory.getDaysFromLastCountDate('2014-07-10')}).toThrow('value provided is not a date object');
    });

    it('should return number of days from given date to the today\'s date', function () {
      var givenDate = new Date('2014-07-10'),
          one_day=1000*60*60*24,
          today = new Date(),
          difference = Math.round((today.getTime() - givenDate.getTime())/one_day),
          expectedDay = stockCountFactory.getDaysFromLastCountDate(givenDate);
          expect(expectedDay).toEqual(difference);
    });
  });

});