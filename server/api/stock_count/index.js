'use strict';

var express = require('express');
var controller = require('./stock_count.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/unopened', auth.isAuthenticated(), controller.unopened);

module.exports = router;
