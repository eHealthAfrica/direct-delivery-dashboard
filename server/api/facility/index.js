'use strict';

var express = require('express');
var controller = require('./facility.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/unrestricted', controller.unrestricted);

module.exports = router;
