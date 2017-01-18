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

        /*
            rocio
        */
        var nombresSeparados = file.name.split('.');
        var nombreSinExtension = "";
        for (var i = 0; i < nombresSeparados.length - 1; i++) {
            nombreSinExtension += nombresSeparados[i];
        }
        console.log('nombreSinExtension ', nombreSinExtension);
        nombreSinExtension += Date.now();
        var nombreConExtension = nombreSinExtension + '.' + nombresSeparados[nombresSeparados.length - 1];
        /*
            /rocio
        */
        console.log('file.name', file.name)
        console.log('file splitted', file.name.split('.'))
        var targetPath = path.resolve('./public/files/' + nombreConExtension);
        fs.rename(tempPath, targetPath, function(err) {
            if (err) {
                throw err
            }
            logger.debug(file.name + " upload complete for user: " + username);
            return res.json({ path: 'files/' + nombreConExtension, fileName: nombreConExtension })
        })
    });
});

router.post('/getFile', function(req, res) {
    var fileToSend = __dirname + '/public/files/' + req.body.file;
    console.log('fileToSend', fileToSend);
    console.log('root', __dirname);
    
    res.sendFile(req.body.file, { root: 'public/files' }, function(err) {
        if (err) {
            console.log('error', err);
        } else {
            console.log('enviado archivo');
        }
    })
})


module.exports = router;
