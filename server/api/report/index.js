'use strict';

var express = require('express');
var controller = require('./report.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/cce-status', auth.isAuthenticated(), controller.cceReport);
module.exports = router;
