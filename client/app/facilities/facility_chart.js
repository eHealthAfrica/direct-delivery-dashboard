'use strict';

angular.module('lmisApp')
  .factory('facilityChart', function() {
    function tallyReporting(summaries) {
      var tally = {
        reporting: {
          key: 'Reporting',
          count: 0
        },
        nonReporting: {
          key: 'Non reporting',
          count: 0
        }
      };

      summaries.forEach(function(summary) {
        if (summary.isNonReporting) {
          tally.nonReporting.count++;
        } else {
          tally.reporting.count++;
        }
      });

      return [
        tally.reporting,
        tally.nonReporting
      ];
    }

    function xFunction() {
      return function(data) {
        return data.key;
      }
    }

    function yFunction() {
      return function(data) {
        return data.count;
      }
    }

    function tooltip() {
      return function(key, x) {
        return key + ': ' + parseInt(x, 10);
      }
    }

    function chart(summaries) {
      return {
        data: tallyReporting(summaries),
        functions: {
          x: xFunction,
          y: yFunction,
          tooltip: tooltip
        }
      };
    }

    return chart;
  });
