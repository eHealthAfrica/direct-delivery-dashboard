'use strict';

angular.module('lmisApp')
  .controller('LedgerCtrl', function($scope, leafletBoundsHelpers, Auth, Pagination, $filter, Places, bundleLines, productTypes, utility) {
    var rows = bundleLines;

    $scope.currentUser = Auth.getCurrentUser();
    $scope.productTypes = productTypes;
    $scope.pagination = new Pagination();
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.ledger = {filterType: 'Incoming Bundle'};
    $scope.totals = [];
    $scope.getFileName = utility.getFileName;
    $scope.csvHeader = [
      'State',
      'Sent From Zone',
      'Sent From LGA',
      'Sent From Ward',
      'Sent From',
      'Receiving Zone',
      'Receiving LGA',
      'Receiving Ward',
      'Receiving Facility',
      'Transaction Date',
      'Date Recorded',
      'Product Expiry Date',
      'Batch Number',
      'Product',
      'Quantity'
    ];

    $scope.map = {
      defaults: {
        maxZoom: 14,
        scrollWheelZoom: false
      },
      center: {},
      bounds: {},
      markers: {},
      paths: {
        lines: {
          weight: 2,
          type: 'multiPolyline',
          latlngs: []
        }
      }
    };

    $scope.place = {
      type: '',
      columnTitle: '',
      search: ''
    };

    $scope.from = {
      opened: false,
      date: moment().startOf('day').subtract(7, 'days').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.to = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.created = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.receivedOn = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.expiryDate = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.getPlaces = function(filter) {
      $scope.places = new Places($scope.place.type, filter);

      return $scope.places.promise;
    };

    $scope.update = function() {
      var ledgerExport = [];
      var totals = {};
      var filterBy = Places.propertyName($scope.place.type);
      var subType = $scope.place.type === Places.FACILITY ? Places.FACILITY : Places.subType($scope.place.type);
      var groupBy = Places.propertyName(subType || $scope.currentUser.access.level);
      var columnTitle = Places.typeName(subType || $scope.currentUser.access.level);
      var filterType = angular.isUndefined($scope.ledger.filterType) ? 'Incoming Bundle' : $scope.ledger.filterType;

      var search = $scope.place.search.toLowerCase();
      $scope.filteredRows = rows.filter(function(row) {
        var date = moment(row.created);
        var include = true;

        if (include && $scope.ledger.filterType)
          include = include && $scope.ledger.filterType.toLowerCase() === row.type.toLowerCase();

        if (include && search && filterBy) {
          var placeName = filterType === 'Incoming Bundle' ? row.receivingFacilityObject[filterBy] : row.sendingFacilityObject[filterBy];
          if (placeName === undefined)
            return false;

          include = include && placeName && (placeName.toLowerCase() === search);
        }

        if (include && $scope.from.date)
          include = include && (date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date));

        if (include && $scope.to.date)
          include = include && (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date));

        return include;
      });

      var bounds = null;
      var lines = {};
      var markers = {};
      $scope.filteredRows.forEach(function(row) {
        ledgerExport.push({
          state: row.receivingFacilityObject.state,
          sendingZone: row.sendingFacilityObject.zone,
          sendingLGA: row.sendingFacilityObject.lga,
          sendingWard: row.sendingFacilityObject.ward,
          sendingFacility: row.sendingFacilityObject.name,
          receivingZone: row.receivingFacilityObject.zone,
          receivingLGA: row.receivingFacilityObject.lga,
          receivingWard: row.receivingFacilityObject.ward,
          receivingFacility: row.receivingFacilityObject.name,
          transactionDate: row.receivedOn,
          created: row.created,
          expiry: row.expiryDate,
          product: row.productProfile,
          quantity: row.quantity
        });

        var key = filterType === 'Incoming Bundle' ? row.receivingFacilityObject[groupBy] : row.sendingFacilityObject[groupBy];
        totals[key] = totals[key] || {
          place: key,
          values: {}
        };

        var code = row.productCode;
        totals[key].values[code] = (totals[key].values[code] || 0) + row.quantity;

        var line = [];
        [row.receivingFacilityObject, row.sendingFacilityObject].forEach(function(facility) {
          var lat = facility.lat ? parseFloat(facility.lat) : NaN;
          var long = facility.long ? parseFloat(facility.long) : NaN;

          if (!isNaN(lat) && !isNaN(long)) {
            if (!bounds)
              bounds = [[lat, long], [lat, long]];
            else {
              bounds[0][0] = Math.min(bounds[0][0], lat);
              bounds[0][1] = Math.min(bounds[0][1], long);
              bounds[1][0] = Math.max(bounds[1][0], lat);
              bounds[1][1] = Math.max(bounds[1][1], long);
            }

            var point = {lat: lat, lng: long, message: facility.name, icon: {type: 'makiMarker', size: 's'}};
            markers[facility._id] = point;
            line.push(point);
          }
        });

        var lineKey = row.receivingFacilityObject._id + '-' + row.sendingFacilityObject._id;
        if (line.length == 2)
          lines[lineKey] = line;
      });

      ledgerExport = $filter('orderBy')(ledgerExport, ['-created']);

      $scope.map.markers = markers;
      $scope.map.paths.lines.latlngs = _.values(lines);
      $scope.map.bounds = bounds ? leafletBoundsHelpers.createBoundsFromArray(bounds) : {};

      $scope.place.columnTitle = columnTitle;
      $scope.totals = Object.keys(totals).map(function(key) {
        var item = totals[key];
        return {
          place: item.place,
          values: $scope.productTypes.map(function(productType) {
            return (item.values[productType] || 0);
          })
        };
      });

      $scope.pagination.totalItems = $scope.filteredRows.length;
      $scope.export = ledgerExport;
      $scope.exportTitle = 'ledger-' + filterType.toLowerCase().replace(/\s/, '-');
    };

    $scope.update();
  });
