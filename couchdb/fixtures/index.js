'use strict';
/*eslint-env node */

var fs = require('fs');
var path = require('path');

var cwd = path.join(__dirname, '/');

function isJSON(file) {
  return file.match(/.json$/);
}

function appendToExports(file) {
  var name = file.replace('.json', '');
  exports[name] = require(cwd + file);
}

fs.readdirSync(cwd)
  .filter(isJSON)
  .forEach(appendToExports);
