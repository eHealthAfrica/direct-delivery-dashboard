'use strict';

describe('Service: utility', function () {

  beforeEach(module('lmisApp'));

  var utility;

  beforeEach(inject(function (_utility_) {
    utility = _utility_;
  }));

  it('should define utility service', function () {
    expect(utility).toBeDefined();
  });

  describe('removeFromArray', function () {
    it('should remove remove value from array', function () {
      var arrayValue = [1, 2, 3, 4];

      expect(arrayValue.length).toEqual(4);
      expect(arrayValue[0]).toEqual(1);
      utility.removeFromArray(1, arrayValue);
      expect(arrayValue.length).toEqual(3);
      expect(arrayValue[0]).toEqual(2);
    });
  });

  describe('castArrayToObject', function () {
    it('should convert array object to object', function () {
      var facilityList = [
        {
          name: 'Murtala Muhammad',
          uuid: '123456'
        },
        {
          name: 'Garin Dau',
          uuid: '654321'
        }
      ];

      var converted = null;

      expect(converted).toBeNull();
      converted = utility.castArrayToObject(facilityList, 'uuid');
      expect(converted).not.toBeNull();
      expect(toString.call(converted)).toEqual('[object Object]');
      expect(converted['123456']).toEqual(facilityList[0]);
    });
  });


  describe('getWeekRangeByDate', function () {
    it('should return the first, last and reminder date', function () {
      var today = new Date();
      var reminderDay = 5; //friday
      var NUMBER_OF_DAYS_IN_A_WEEK = 6; //starting from 0;

      var firstDayOfCurrentWeek = today.getDate() - today.getDay();

      var reminderDate = new Date(
        today.getFullYear(),
        today.getMonth(),
          firstDayOfCurrentWeek + reminderDay, 0, 0, 0
      );

      var lastDate = new Date(
        today.getFullYear(),
        today.getMonth(),
          firstDayOfCurrentWeek + NUMBER_OF_DAYS_IN_A_WEEK, 0, 0, 0
      );

      var firstDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        firstDayOfCurrentWeek, 0, 0, 0
      );

      var result = utility.getWeekRangeByDate(today, reminderDay);

      expect(result.first).toEqual(firstDate);
      expect(result.last).toEqual(lastDate);
      expect(result.reminderDate).toEqual(reminderDate);
    });
  });

});