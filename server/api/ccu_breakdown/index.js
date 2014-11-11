'use strict';

var express = require('express');
var controller = require('./ccu_breakdown.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/by_date', auth.isAuthenticated(), controller.byDate);
router.get('/all', auth.isAuthenticated(), controller.all);

module.exports = router;
