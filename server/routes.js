/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/users', require('./api/user'));

  app.use('/api/facilities', require('./api/facility'));
  app.use('/api/wards', require('./api/ward'));
  app.use('/api/lgas', require('./api/lga'));
  app.use('/api/zones', require('./api/zone'));
  app.use('/api/states', require('./api/state'));
  app.use('/api/cceis', require('./api/ccei'));
  app.use('/api/uoms', require('./api/uom'));
  app.use('/api/bundles', require('./api/bundle'));
  app.use('/api/product_categories', require('./api/product_category'));
  app.use('/api/product_presentations', require('./api/product_presentation'));
  app.use('/api/product_profiles', require('./api/product_profile'));
  app.use('/api/product_types', require('./api/product_type'));
  app.use('/api/ccu_breakdown', require('./api/ccu_breakdown'));
  app.use('/api/ccu_breakdown2', require('./api/ccu_breakdown2'));
  app.use('/api/waste_count', require('./api/waste_count'));
  app.use('/api/waste_count', require('./api/waste_count'));
  app.use('/api/stock_count', require('./api/stock_count'));
  app.use('/api/stock_out', require('./api/stock_out'));
  app.use('/api/app_config', require('./api/app_config'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
