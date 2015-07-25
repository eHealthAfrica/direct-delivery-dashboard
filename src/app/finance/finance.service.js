angular.module('finance')
  .service('financeService', function (dbService, pouchUtil, log, utility) {
    var _this = this, FUEL_PRICE = 87;

    function formatValues (row) {
      row = row.value;
      var amountGiven = row.amountGiven || 0;
      var totalKM = _this.totalKM(row.distanceAfter, row.distanceBefore);
      var totalAmountSpent = _this.totalAmountSpent(amountGiven, row.fuelVoucher);
      var fuelConsumption = _this.fuelConsumption(totalAmountSpent);
      var averageFuelUsage = _this.averageFuelUsage(totalKM, fuelConsumption);
      var kmDifference = _this.kmDifference(totalKM, row.estimatedDistance);

      return {
        driver: row.delivery.driverID,
        vehicle: row.vehicle,
        date: row.delivery.date,
        zone: _this.getLocation('zone', row.facilityRounds),
        lga: _this.getLocation('lga', row.facilityRounds),
        estimatedDistance: row.estimatedDistance,
        distanceBefore: row.distanceBefore,
        distanceAfter: row.distanceAfter,
        amountGiven: amountGiven,
        totalKM: totalKM,
        fuelConsumption: fuelConsumption,
        totalAmountSpent: totalAmountSpent,
        averageFuelUsage: averageFuelUsage,
        kmDifference: kmDifference,
        fuelVoucher: row.fuelVoucher
      };
    }

    _this.formatList = function(list) {
      if (list.length === 0) {
        return [];
      }
      return list.map(formatValues);
    };

    this.all = function() {
      var view = 'finance/all';
      var params = {};
      return dbService.getView(view, params)
        .then(function(res) {
          return _this.formatList(res.rows);
        });
    };

    _this.getLocation = function(type, roundInformation) {
      var location = [];
      for(var i = 0; i < roundInformation.length; i++) {
        if (roundInformation[i][type] && location.indexOf(roundInformation[i][type]) === -1) {
          location.push(roundInformation[i][type]);
        }
      }
      return location.join('/');
    };

    _this.totalKM = function(kmIN, kmOUT) {
      return kmIN - kmOUT;
    };

    _this.fuelConsumption = function(amountSpent) {
      return parseInt(amountSpent)/FUEL_PRICE;
    };

    _this.totalAmountSpent = function(amount, fuelVoucher) {
      return parseInt(amount) + parseInt(fuelVoucher);
    };

    _this.averageFuelUsage = function(totalKM, totalFuel) {
      return totalKM/totalFuel;
    };

    _this.kmDifference = function(totalKM, estimatedKM) {
      return totalKM - estimatedKM;
    }

  });
