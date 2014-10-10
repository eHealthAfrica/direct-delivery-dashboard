'use strict';

var express = require('express');
var controller = require('./ccu_breakdown2.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.all);

module.exports = router;
