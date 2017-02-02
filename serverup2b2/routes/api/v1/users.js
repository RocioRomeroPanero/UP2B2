'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var config = require('../../../config');
var crypto = require("crypto");
require('../../../models/userModel');
var User = mongoose.model('User'); // pido el modelo

var generator = require('random-password-generator');
var services = require('../../../public/javascripts/services');
var middleware = require('../../../public/javascripts/middleware');

var nodemailer = require('nodemailer');

// Get users

router.get('/', middleware.ensureAuthenticated, function(req, res) {

    var sort = req.query.sort || 'email';

    var filters = {};

    console.log("filters", filters);
    // como quiero obtener todos los usuarios, no introduzco filtro: {}
    User.list(filters, sort, function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        if (rows.length != 0) {
            return res.status(200).send({ result: 'sucess', rows: rows })
        } else {
            return res.status(404).send({ result: 'no users yet' })
        }

    });
});

// get users ordered by score

router.get('/ranking', middleware.ensureAuthenticated, function(req, res) {
    var sort = 'score';
    User.list({}, sort, function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        return res.status(200).send({ result: 'sucess', rows: rows })
    })
})

// get an user
router.get('/:id', middleware.ensureAuthenticated, function(req, res) {

    var sort = req.query.sort || 'email';

    var filters = {};

    filters._id = req.params.id;

    User.list(filters, sort, function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        if (rows.length != 0) {
            return res.status(200).send({ result: 'sucess', rows: rows })
        } else {
            return res.status(404).send({ result: 'no user with this id' })
        }

    });
});

// New user

router.post('/newUser',function(req, res) {

    let user = {};
    var email = req.body.email.toLowerCase();
    let filters = {};
    filters.email = email;
    //comprobar si existe ese nombre en la base de datos primero!
    User.list(filters, 'email', function(err, rows) {
        if (err) {
            res.status(500).send({ result: 'internal error in database', err: err })
            return;
        }
        if (rows.length !== 0) { // user already exists
            res.status(499).send({ result: 'user with this email already exists' })
            return;
        } else { // user doesn't exist, lets create it
            var newPass = generator.generate();
            let sha256 = crypto.createHash("sha256");

            sha256.update(newPass, "utf8"); //utf8 here

            let passConHash = sha256.digest("base64");

            user.pass = passConHash;

            user.email = email;
            user.dni = req.body.dni;
            user.fullName = req.body.fullName;
            user.score = 0;
            user.degree = req.body.degree;
            user.admin = req.body.admin;
            user.creationTime = Date.now();
            user.testDone = [];

            console.log('user', user);
            console.log('req.body', req.body);
            let user2 = new User(user); // creamos el objeto en memoria, aún no está en la base de datos

            user2.save(function(err, newRow) { // lo guardamos en la base de datos
                //newRow contiene lo que se ha guardado, la confirmación
                if (err) {
                    return res.status(500).send({ result: 'internal error in database', err: err })
                }
                var htmlEmail = '<b>Hello ' + req.body.fullName + ',</b> <p> Welcome to Up2B2! Your account settings are: </p>';
                htmlEmail += '<p>Email: ' + req.body.email.toLowerCase() + '</p>';
                htmlEmail += '<p>Password: ' + newPass + '</p>';
                htmlEmail += '<p>Please change this password in "my profile" section</p>';

                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: config.user, // Your email id
                        pass: config.pass // Your password
                    }
                });

                var mailOptions = {
                    from: config.user, // sender address
                    to: req.body.email.toLowerCase(),
                    bcc: config.bccEmail,
                    subject: config.emailRegistrationSubject, // Subject line
                    html: htmlEmail
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                        if (err) return res.status(500).send({ result: "internal error sending the email!" });
                    } else {
                        console.log('Message sent: ' + info.response);
                        return res.status(200).send({ result: 'user created', row: newRow })
                    };
                });

            });
        }
        return;
    });
});

// Login

router.post('/login', function(req, res) {

    var email = req.body.email.toLowerCase();
    var pass = req.body.pass;
    var filters = {};
    filters.email = email;

    User.list(filters, 'email', function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        if (rows.length !== 0) { 
            let sha256 = crypto.createHash("sha256");
            sha256.update(pass, "utf8"); //utf8 here
            let passConHash = sha256.digest("base64");
            var resultado = [];

            if (passConHash === rows[0].pass) {
                resultado[0] = {
                    '_id': rows[0]._id,
                    'token': services.createToken(rows[0]),
                    'pass': rows[0].pass,
                    'email': rows[0].email,
                    'fullName': rows[0].fullName,
                    'dni': rows[0].dni,
                    'degree': rows[0].degree,
                    'admin': rows[0].admin,
                    'score': rows[0].score
                }
                return res.status(200).send({ result: 'sucess login', data: resultado })
            } else {
                return res.status(401).send({ result: "user and pass doesn't match" })
            }
        } else {
            return res.status(404).send({ result: 'user not found' })
        }
    })
});

// Delete an user

router.delete('/:id', middleware.ensureAuthenticated, function(req, res) {
    User.remove({ _id: req.params.id }, function(err) {
        if (err) return res.status(500).send({ result: "internal error in database: maybe this user doesn't exist?" })
        return res.status(200).send({ result: "user deleted" })
    });
});

// Modify an user

router.put('/userData/:id', middleware.ensureAuthenticated, function(req, res) {

    var filters = {};

    filters._id = req.params.id;
    console.log('req.body', req.body);
    if (req.body.pass != undefined) {
        let sha256 = crypto.createHash("sha256");
        sha256.update(req.body.pass, "utf8"); //utf8 here
        let passConHash = sha256.digest("base64");
        req.body.pass = passConHash;
    }

    User.findByIdAndUpdate(req.params.id, req.body, {}, function(err, data) {
        if (err) return res.status(500).send({ result: "internal error in database: maybe this user doesn't exist?" })
        return res.status(200).send({ result: "user modified", data: data });
    })

})

module.exports = router;
