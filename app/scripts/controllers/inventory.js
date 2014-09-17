'use strict';

angular.module('lmisApp')
  .controller('InventoryCtrl', function ($scope, $q, ProductType, ProductCategory, utility) {
    $scope.loading = false;
    $scope.error = false;
    $scope.places = null;
    $scope.productTypes = [];
    $scope.totals = [];
    var zones = ['Bagwai', 'Bichi', 'Gwarzo', 'Kunchi', 'Kunchi', 'Tsanyawa'];

    $q.all([ProductType.all(), ProductCategory.all()])
      .then(function (res) {
        var types = res[0];
        console.log(types);
        var categories = res[1];
        var productTypes = utility.values(types);
        $scope.productTypes = productTypes.map(function (p) {
          var style = categories[p.category];
          if (angular.isObject(style)) {
            style = ProductCategory.getStyle(style.name);
          } else {
            style = '';
          }
          return {
            code: p.code,
            style: style
          };
        });
        $scope.totals = zones.map(function (zone) {
          return {
            place: zone,
            values: productTypes.map(function () {
              return  Math.floor((Math.random() * 100) + 1);
            })
          };
        });
      })
      .catch(function (err) {
        console.error(err);
      });

    $scope.place = {
      type: 0,
      columnTitle: 'LGA',
      search: ''
    };

    $scope.getStyle = function (name) {
      return ProductCategory.getStyle(name);
    };

    ProductCategory.all()
      .then(function (res) {
        console.info(res);
      })
      .catch(function (err) {
        console.error(err);
      });

    $scope.updateTotals = function () {
      var totals = {};
      var filterBy = 'state';
      var groupBy = 'zone';
      var columnTitle = 'Zone';
      switch (parseInt($scope.place.type)) {
        case 1:
          filterBy = 'zone';
          groupBy = 'lga';
          columnTitle = 'LGA';
          break;
        case 2:
          filterBy = 'lga';
          groupBy = 'ward';
          columnTitle = 'Ward';
          break;
        case 3:
          filterBy = 'ward';
          groupBy = 'facility';
          columnTitle = 'Facility';
          break;
        case 4:
          filterBy = 'facility';
          groupBy = 'facility';
          columnTitle = 'Facility';
          break;
      }
    };

  })
;
