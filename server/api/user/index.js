'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole('admin'), controller.create);
router.get('/me', auth.isAuthenticated(), controller.me);

module.exports = router;
