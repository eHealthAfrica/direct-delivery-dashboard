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

    function getGrouped(group, type, row) {
      if (!group.hasOwnProperty(type)) {
        group[type] = {};
      }
      group = groupByZone(group, row, type);
      group = groupByLGA(group, row, type);
      group = groupByWard(group, row, type);

      return group;
    }

    function groupByWard(group, row, type) {
      if (!group[type][row.zone][row.lga].hasOwnProperty(row.ward)) {
        group[type][row.zone][row.lga][row.ward] = {};
      }

      if (type === 'ward' &&  !group[type][row.zone][row.lga][row.ward].hasOwnProperty(row.productID)) {
        group[type][row.zone][row.lga][row.ward][row.productID] = defaultFields();
        group[type][row.zone][row.lga][row.ward][row.productID] = updateProductCount(group[type][row.zone][row.lga][row.ward][row.productID], row);
      }

      return group;
    }

    function groupByLGA(group, row, type) {
      if (!group[type][row.zone].hasOwnProperty(row.lga)) {
        group[type][row.zone][row.lga] = {};
      }

      if (type === 'lga' &&  !group[type][row.zone][row.lga].hasOwnProperty(row.productID)) {
        group[type][row.zone][row.lga][row.productID] = defaultFields();
        group[type][row.zone][row.lga][row.productID] = updateProductCount(group[type][row.zone][row.lga][row.productID], row);
      }
      return group;
    }

    function groupByZone(group, row, type) {
      if (!group[type].hasOwnProperty(row.zone)) {
        group[type][row.zone] = {};
      }

      if (type === 'zone' &&  !group[type][row.zone].hasOwnProperty(row.productID)) {
        group[type][row.zone][row.productID] = defaultFields();
        group[type][row.zone][row.productID] = updateProductCount(group[type][row.zone][row.productID], row);
      }
      return group;
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
      var grouped = {
        zone: {},
        lga: {},
        ward: {}
      };
      var products = [];

      while (i--) {
        var row = rows[i].value;
        grouped = getGrouped(grouped, 'zone', row);
        grouped = getGrouped(grouped, 'lga', row);
        grouped = getGrouped(grouped, 'ward', row);
        products = getProducts(products, row);
      }

      return {
        group: grouped,
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
