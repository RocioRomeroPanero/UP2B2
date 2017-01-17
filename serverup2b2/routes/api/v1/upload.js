'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var logger = require('winston');
var crypto = require("crypto");
var formidable = require('formidable');
var services = require('../../../public/javascripts/services');
var middleware = require('../../../public/javascripts/middleware');


router.post('', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var file = files.file;
        var username = fields.username;
        var tempPath = file.path;
        var targetPath = path.resolve('./public/photos/' + file.name);
        fs.rename(tempPath, targetPath, function(err) {
            if (err) {
                throw err
            }
            logger.debug(file.name + " upload complete for user: " + username);
            return res.json({ path: 'photos/' + username + '/' + file.name })
        })
    });
});

module.exports = router;
