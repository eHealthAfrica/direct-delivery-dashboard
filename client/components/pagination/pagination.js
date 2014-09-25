'use strict';

/**
 * Utility class for using the UI Bootstrap pagination component.
 */
angular.module('lmisApp')
  .service('Pagination', function () {

    function Pagination() {
      this.totalItems = 0;
      this.currentPage = 1;
      this.itemsPerPage = 50;
      this.limit = 0;
      this.count = 0;
    }

    Pagination.prototype.totalItemsChanged = function (count) {
      this.totalItems = count;
      this.update();
    };

    Pagination.prototype.pageChanged = function () {
      this.update();
    };

    Pagination.prototype.update = function () {
      this.limit = Math.min(this.totalItems, this.currentPage * this.itemsPerPage);
      this.count = Math.min(this.itemsPerPage, this.totalItems - ((this.currentPage - 1) * this.itemsPerPage));
    };

    return Pagination;
  });