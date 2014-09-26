'use strict';

var express = require('express');
var controller = require('./stock_out.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/by_date', controller.byDate);

module.exports = router;
