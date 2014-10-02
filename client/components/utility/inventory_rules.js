'use strict';

angular.module('lmisApp')
  .factory('InventoryRules', function () {

    // Returns the average of a list of numbers
    var average = function(things) {
      var sum = 0;
      for(var i = things.length - 1; i >= 0; i--) {
        sum = sum + things[i];
      }
      return sum / things.length;
    };

    var randInterval = function(min, max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    };

    //TODO move these into a stat class like stats(productype).leadtime.avg() etc
    /** 
    * Average lead time for a given product type
    * Should be calculated from past lead times of orders for given product type
    * @param {String} uuid of product type for which to get lead time data
    * @return {Number} average lead time for product type in days
    */
    var leadTimeAvgByProductType = function (productTypeUuid)
    {
      var avgLeadTimeMocks = {
        '00f987e4-54e1-46f0-820b-b249a6d38759': 6.8,
        '0930b906-4802-4a65-8516-057bd839db3e':  5.13,
        '111fbb51-0c5a-492a-97f6-2c7664e23d01':  5.13,
        '1203c362-b7a8-499a-b7ba-b842bace7920':  5.13,
        '19e16c20-04b7-4e06-a679-7f7b60d976be':  6.8,
        '251fc8c2-0273-423f-a519-4ea20fc74832':  5.27,
        '2fee31f0-7757-4f06-9914-d16c5ca9cc5f':  5.27,
        '367f3f7f-a1cc-4266-8a0a-020722576cc9':  5,
        '401f8608-e232-4c5a-b32d-032d632abf88':  5,
        '939d5e05-2aa4-4883-9246-35c60dfa06a5':  5.13,
        'abe41e88-ab4a-4c6f-b7a4-4549e13fb758':  6.8,
        'db513859-4491-4db7-9343-4980a16c8b04':  6.8,
        'e55e1452-b0ab-4046-9d7e-3a98f1f968d0':  6.8,
        'f7675c7e-856a-45e8-b2af-d50f42950ac1':  5.27,
        'f96946be-7dac-438e-9220-efc386276481':  5.27
      };

      return avgLeadTimeMocks[productTypeUuid];
    }

    /** 
    * Standard deviation of lead time for given product type
    * Should be calculated from past lead times of orders for given product type
    * @param {String} uuid of product type for which to get lead time data
    * @return {Number} standard deviation of lead times for product type in days
    */
    var leadTimeStdByProductType = function (productTypeUuid)
    {
      var stdLeadTimeMocks = {
        '00f987e4-54e1-46f0-820b-b249a6d38759':  2.83,
        '0930b906-4802-4a65-8516-057bd839db3e':  2.68,
        '111fbb51-0c5a-492a-97f6-2c7664e23d01':  2.68,
        '1203c362-b7a8-499a-b7ba-b842bace7920':  2.68,
        '19e16c20-04b7-4e06-a679-7f7b60d976be':  2.83,
        '251fc8c2-0273-423f-a519-4ea20fc74832':  2.64,
        '2fee31f0-7757-4f06-9914-d16c5ca9cc5f':  2.64,
        '367f3f7f-a1cc-4266-8a0a-020722576cc9':  2,
        '401f8608-e232-4c5a-b32d-032d632abf88':  2,
        '939d5e05-2aa4-4883-9246-35c60dfa06a5':  2.68,
        'abe41e88-ab4a-4c6f-b7a4-4549e13fb758':  2.83,
        'db513859-4491-4db7-9343-4980a16c8b04':  2.83,
        'e55e1452-b0ab-4046-9d7e-3a98f1f968d0':  2.83,
        'f7675c7e-856a-45e8-b2af-d50f42950ac1':  2.64,
        'f96946be-7dac-438e-9220-efc386276481':  2.64
      };
      return stdLeadTimeMocks[productTypeUuid];
    }

    /** 
    * Average consumption for given product type
    * Should be calculated from past consumption of given product type
    * @param {String} uuid of product type for which to get consumption data
    * @return {Number} consumption average in standard units for product type / day
    */
    var consumptionAvgByProductType = function (productTypeUuid)
    {
      var avgConsumptionMocks = {
        '00f987e4-54e1-46f0-820b-b249a6d38759':  20.29,
        '0930b906-4802-4a65-8516-057bd839db3e':  20.39,
        '111fbb51-0c5a-492a-97f6-2c7664e23d01':  20.29,
        '1203c362-b7a8-499a-b7ba-b842bace7920':  20.39,
        '19e16c20-04b7-4e06-a679-7f7b60d976be':  20.29,
        '251fc8c2-0273-423f-a519-4ea20fc74832':  100,
        '2fee31f0-7757-4f06-9914-d16c5ca9cc5f':  25.1,
        '367f3f7f-a1cc-4266-8a0a-020722576cc9':  10,
        '401f8608-e232-4c5a-b32d-032d632abf88':  100,
        '939d5e05-2aa4-4883-9246-35c60dfa06a5':  25.1,
        'abe41e88-ab4a-4c6f-b7a4-4549e13fb758':  20.39,
        'db513859-4491-4db7-9343-4980a16c8b04':  20.39,
        'e55e1452-b0ab-4046-9d7e-3a98f1f968d0':  20.39,
        'f7675c7e-856a-45e8-b2af-d50f42950ac1':  20.29,
        'f96946be-7dac-438e-9220-efc386276481':  20.29
      };
      return avgConsumptionMocks[productTypeUuid];
    }

    /** 
    * Standard deviation of consumption for given product type
    * Should be calculated from past consumption of given product type
    * @param {String} uuid of product type for which to get consumption data
    * @return {Number} consumption standard deviation in standard units for product type / day
    */
    var consumptionStdByProductType = function (productTypeUuid)
    {
      var stdConsumptionMocks = {
        '00f987e4-54e1-46f0-820b-b249a6d38759':  10,
        '0930b906-4802-4a65-8516-057bd839db3e':  15.09,
        '111fbb51-0c5a-492a-97f6-2c7664e23d01':  10,
        '1203c362-b7a8-499a-b7ba-b842bace7920':  15.09,
        '19e16c20-04b7-4e06-a679-7f7b60d976be':  10,
        '251fc8c2-0273-423f-a519-4ea20fc74832':  50,
        '2fee31f0-7757-4f06-9914-d16c5ca9cc5f':  13.68,
        '367f3f7f-a1cc-4266-8a0a-020722576cc9':  5,
        '401f8608-e232-4c5a-b32d-032d632abf88':  50,
        '939d5e05-2aa4-4883-9246-35c60dfa06a5':  13.68,
        'abe41e88-ab4a-4c6f-b7a4-4549e13fb758':  15.09,
        'db513859-4491-4db7-9343-4980a16c8b04':  15.09,
        'e55e1452-b0ab-4046-9d7e-3a98f1f968d0':  15.09,
        'f7675c7e-856a-45e8-b2af-d50f42950ac1':  10,
        'f96946be-7dac-438e-9220-efc386276481':  10
      };
      return stdConsumptionMocks[productTypeUuid];
    }
     
    /**
    * Temporary version of per-producttype LTC
    */
    var leadTimeConsumptionByProductType = function(productTypeUuid)
    {
      return leadTimeAvgByProductType(productTypeUuid) * consumptionAvgByProductType(productTypeUuid);
    }

    /**
    * Temporary version of per-producttype buffer stock
    */
    var bufferByProductType = function(productTypeUuid)
    {
      return serviceFactor() * Math.sqrt(
        leadTimeAvgByProductType(productTypeUuid) * Math.pow(leadTimeStdByProductType(productTypeUuid),2.0)
        + Math.pow(consumptionAvgByProductType(productTypeUuid),2.0) * Math.pow(leadTimeStdByProductType(productTypeUuid), 2.0));
    }

    /**
    * Temporary version of per-producttype rop
    */
    var reorderPointByProductType = function(productTypeUuid)
    {
      return bufferByProductType(productTypeUuid) + leadTimeConsumptionByProductType(productTypeUuid);
    }

    /**
     * Order lead time.
     *
     * The duration between the time an order is authorized and the time the
     * bundle arrives at the facility, measured in days.
     *
     * @param {Object} order An order object with created & date_receipt fields
     * @return {Number} the lead time in ms
     * @throws error on an invalid date field
     */
    var leadTime = function(order) {
      var isValidDate = function isValidDate(date) {
        if(Object.prototype.toString.call(date) !== '[object Date]') {
          return false;
        }
        if(isNaN(date.getTime())) {
          throw new Error(date);
        }
      };

      var created = new Date(order.created);
      // jshint camelcase: false
      var received = new Date(order.date_receipt);

      isValidDate(created);
      isValidDate(received);

      if(created > received) {
        throw new Error('Order was created before it was received');
      }

      return received - created;
    };

    /**
     * Consumption.
     *
     * The amount of its inventory a facility consumes per the forecasting
     * interval.
     *
     * @param {Object} facility The facility object.
     * @return {Number} the consumption level.
     */
    // jshint unused: false
    var consumption = function(facility) {
      // FIXME: Awaiting discussion, see #222
      return 10;
    };

    /**
     * The average consumption during the lead-time period.
     *
     * @param {Object} leadTimes An array of order lead times
     * @param {Object} consumptions An array of consumption levels
     * @return {Number} average LTC in ms
     */
     var leadTimeConsumption = function(leadTimes, consumptions) {
      var leadAvg = average(leadTimes),
      consAvg = average(consumptions);

      return leadAvg * consAvg;
    };

    /**
     * Service factor.
     *
     * The desired level (availability) of facility service expressed as a
     * percentage.
     *
     * @param {Number} serviceLevel A facility's desired service level.
     * @return {Number} the service factor as a decimal
     */
    var serviceFactor = function(serviceLevel) {
      var serviceFactor = serviceLevel;
      // TODO: bring in actual normsinv function (JStat?)
      serviceFactor = 1.28;
      return serviceFactor;
    };

    /**
     * Buffer stock.
     *
     * The minimum level of each product profile a facility must maintain on
     * site at all times given its supply access, consumption patterns, and
     * desired service level.
     *
     * @param {Object[]} inventories The inventory held at a facility
     * @param {Number} serviceFactor The facility's service factor
     * @return {Number[]} the buffer levels for each product
     */
    var bufferStock = function(inventories, serviceFactor, consumption) {
      // var leadTimes = [];
      // inventories.forEach(function(inventory) {
      //   leadTimes.push(leadTime(inventory));
      // });
      // var avgLeadTime = average(leadTimes);

      // var first = Math.pow(avgLeadTime * consumption, 2),
      //     second = Math.pow(consumption, 2) * Math.pow(avgLeadTime, 2);
      // var buffer = serviceFactor * Math.sqrt(first + second);

      // TODO: calculate real buffer
      inventories.forEach(function(inventory) {
        inventory.buffer = randInterval(100, 300);
      });
      return inventories;
    };

    /**
     * Reorder point.
     *
     * The inventory level for each item in a facility stock list at which a
     * refill of supplies must be ordered.
     *
     * @param {Object} inventories The facility's inventory
     * @return {Object} the facility's inventory
     */
    var reorderPoint = function(inventory) {
      inventory.min = inventory.buffer + 10;
      return inventory;
    };

    return {
      leadTime: leadTime,
      consumption: consumption,
      leadTimeConsumption: leadTimeConsumption,
      serviceFactor: serviceFactor,
      bufferStock: bufferStock,
      reorderPoint: reorderPoint
    };
  });
