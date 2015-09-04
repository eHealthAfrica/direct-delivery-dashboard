'use strict';

angular.module('reports')
  .service('parkingReportService', function(dbService) {
    var _this = this;

    function defaultFields() {
      return {
        expectedQty: 0,
        returnedQty: 0,
        onHandQty: 0,
        deliveredQty: 0
      };
    }

    function singleCollate(object, row) {
      var expectedQty = [
        row.zone,
        'Expected'

      ].join('#');
      var returnedQty = [
        row.zone,
        'Returned'
      ].join('#');
      var onHandQty = [
        row.zone,
        'On Hand'
      ].join('#');
      var deliveredQty = [
        row.zone,
        'Delivered'
      ].join('#');

      if (!object.hasOwnProperty(expectedQty)) {
        object[expectedQty] = {
          type: 'expectedQty',
          zone: row.zone,
          title: 'Expected'
        };
      }

      if (!object.hasOwnProperty(returnedQty)) {
        object[returnedQty] = {
          type: 'returnedQty',
          zone: row.zone,
          title: 'Returned'
        };
      }

      if (!object.hasOwnProperty(onHandQty)) {
        object[onHandQty] = {
          type: 'onHandQty',
          zone: row.zone,
          title: 'On Hand'
        };
      }

      if (!object.hasOwnProperty(deliveredQty)) {
        object[deliveredQty] = {
          type: 'deliveredQty',
          zone: row.zone,
          title: 'Delivered'
        };
      }

      if (!object[expectedQty].hasOwnProperty(row.productID)) {
        object[expectedQty][row.productID] = 0;
      }

      if (!object[returnedQty].hasOwnProperty(row.productID)) {
        object[returnedQty][row.productID] = 0;
      }

      if (!object[onHandQty].hasOwnProperty(row.productID)) {
        object[onHandQty][row.productID] = 0;
      }

      if (!object[deliveredQty].hasOwnProperty(row.productID)) {
        object[deliveredQty][row.productID] = 0;
      }

      object[expectedQty][row.productID] += row.expectedQty || 0;
      object[returnedQty][row.productID] += row.returnedQty || 0;
      object[onHandQty][row.productID] += row.onHandQty || 0;
      object[deliveredQty][row.productID] += row.deliveredQty || 0;

      return object;
    }

    function byZone(group, row) {
      var zone = row['zone'];

      if (!group.hasOwnProperty('zone')) {
        group['zone'] = {};
      }

      if (!group['zone'].hasOwnProperty(zone)) {
        group['zone'][zone] = {};
      }

      if (!group['zone'][zone].hasOwnProperty(row.productID)) {
        group['zone'][zone][row.productID] = defaultFields();
      }
      group['zone'][zone][row.productID] = updateProductCount(group['zone'][zone][row.productID], row);
      return group['zone'];
    }

    function byLGA(group, row) {
      var zone = row['zone'];
      var lga = row['lga'];

      if (!group.hasOwnProperty('lga')) {
        group['lga'] = {};
      }

      if (!group['lga'].hasOwnProperty(zone)) {
        group['lga'][zone] = {};
      }

      if (!group['lga'][zone].hasOwnProperty(lga)) {
        group['lga'][zone][lga] = {};
      }

      if (!group['lga'][zone][lga].hasOwnProperty(row.productID)) {
        group['lga'][zone][lga][row.productID] = defaultFields();
      }
      group['lga'][zone][lga][row.productID] = updateProductCount(group['lga'][zone][lga][row.productID], row);
      return group['lga'];
    }

    function byWard(group, row) {
      var zone = row['zone'];
      var lga = row['zone'];
      var ward = row['zone'];

      if (!group.hasOwnProperty('ward')) {
        group['ward'] = {};
      }

      if (!group['ward'].hasOwnProperty(zone)) {
        group['ward'][zone] = {};
      }

      if (!group['ward'][zone].hasOwnProperty(lga)) {
        group['ward'][zone][lga] = {};
      }

      if (!group['ward'][zone][lga].hasOwnProperty(ward)) {
        group['ward'][zone][lga][ward] = {};
      }

      if (!group['ward'][zone][lga][ward].hasOwnProperty(row.productID)) {
        group['ward'][zone][lga][ward][row.productID] = defaultFields();
      }
      group['ward'][zone][lga][ward][row.productID] = updateProductCount(group['ward'][zone][lga][ward][row.productID], row);
      return group['ward'];
    }

    var groupingFunction = {
      zone: byZone,
      lga: byLGA,
      ward: byWard
    };


    function groupBy(group, type, row) {
      return groupingFunction[type](group, row);
    }

    function getProducts(list, row) {
      if (list.indexOf(row.productID) === -1) {
        list.push(row.productID);
      }

      return list;
    }

    function updateProductCount(object, row) {
      object.expectedQty += row.expectedQty || 0;
      object.returnedQty += row.returnedQty || 0;
      object.onHandQty += row.onHandQty || 0;
      object.deliveredQty += row.deliveredQty || 0;

      return object;
    }

    function collatePackingReport(response) {
      var rows = response.rows;
      var i = rows.length;
      var grouped = {};
      var products = [];
      var newGroup = {};

      while (i--) {
        var row = rows[i].value;
        grouped.zone = groupBy(grouped, 'zone', row);
        grouped.lga = groupBy(grouped, 'lga', row);
        grouped.ward = groupBy(grouped, 'ward', row);
        products = getProducts(products, row);
        newGroup = singleCollate(newGroup, row);
      }
      return {
        group: grouped,
        report: newGroup,
        products: products
      };
    }

    _this.getParkingReport = function (startDate, endDate) {

      var view = 'reports/parking-by-date';
      startDate = new Date(startDate).toJSON();
      endDate = new Date(endDate).toJSON();
      var options = {
        startkey: [startDate],
        endkey: [endDate, {}, {}]
      };
      return dbService.getView(view, options)
        .then(collatePackingReport);
    };

  });
