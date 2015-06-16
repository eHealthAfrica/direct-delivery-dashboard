'use strict';

describe('utility', function(){

  beforeEach(module('utility', 'config'));

  var utility, dateFormat;
  beforeEach(inject(function(_utility_){
    utility = _utility_;
    dateFormat = 'yyyy-MM-dd'
  }));

  it('should format date', function(){
    var date = "2015-01-22T09:38:50.556Z";
    var expected = "2015-01-22";
    var res = utility.formatDate(date, dateFormat);
    expect(res).toBe(expected);
  });

  describe('isValidDate', function(){
    it('Should return TRUE if valid date string is given', function() {
      var dateString = new Date().toJSON();
      var result = utility.isValidDate(dateString);
      expect(result).toBeTruthy();
    });

    it('Should return FALSE if date is null', function() {
      var date = null;
      var result = utility.isValidDate(date);
      expect(result).toBeFalsy();
    });

    it('Should return False if date is undefined', function() {
      var date;//undefined
      var result = utility.isValidDate(date);
      expect(result).toBeFalsy();
    });

    it('Should return FALSE if date is not date object', function() {
      var date = { name: 'jide' };
      var result = utility.isValidDate(date);
      expect(result).toBeFalsy();
    });

    it('Should return TRUE if date is valid date object', function() {
      var date = new Date();
      var result = utility.isValidDate(date);
      expect(result).toBeTruthy();
    });
  });

});
