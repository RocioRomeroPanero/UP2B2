'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var crypto = require("crypto");

var services = require('../../../public/javascripts/services');
var middleware = require('../../../public/javascripts/middleware');


router.post('', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: null });
    })
});

module.exports = router;
