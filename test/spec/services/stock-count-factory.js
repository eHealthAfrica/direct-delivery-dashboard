'use strict';

describe('factory: stockCountFactory', function () {
  beforeEach(module('lmisApp', 'appConfigMocks', 'stockCountMocks'));

  var stockCountFactory,
      stockCount,
      appConfig;

  var fakeStockCount = [
    {
      'doc': {
        'facility': 'facility-1',
        'created': '2014-06-14T09:53:23.410Z',
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

  beforeEach(inject(function (_stockCountFactory_, stockCountMock, appConfigMock) {
    stockCountFactory = _stockCountFactory_;
    stockCount = stockCountMock;
    appConfig = appConfigMock
  }));

  describe('groupByFacility', function () {
    it('should group stockCount by facility uuid', function () {
      var groupedStockCount = stockCountFactory.groupByFacility(fakeStockCount);

      expect(toString.call(groupedStockCount)).toEqual('[object Object]');
      expect(groupedStockCount['facility-1'].length).toEqual(2);
    });
  });

  describe('getSortedStockCount', function () {

    it('should sort stock count by created date in a descending order', function () {
      var sortedCount = stockCountFactory.getSortedStockCount(fakeStockCount);
      console.log(JSON.stringify(sortedCount));
      expect(sortedCount[0].doc.created).toEqual('2014-07-09T09:56:16.682Z');
    });

  });

});