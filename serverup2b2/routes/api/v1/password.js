'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var crypto = require("crypto");
require('../../../models/userModel');
var User = mongoose.model('User'); // pido el modelo
var generator = require('random-password-generator');
var nodemailer = require('nodemailer');

// Send email for new password

router.post('/', function(req, res) {

    // buscar a la persona con ese email, para obtener el nombre y tal (y ver si existe o no)...

    let filters = {};
    filters.email = req.body.email;

    User.list(filters, 'email', function(err, rows) {
        if (err) {
            res.status(500).send({ result: 'internal error in database', err: err })
            return;
        }
        if (rows.length !== 0) { // user already exists
            console.log('rows', rows);
            var newPass = generator.generate();
            let sha256 = crypto.createHash("sha256");
            sha256.update(newPass, "utf8"); //utf8 here
            let newPassHashed = sha256.digest("base64");
            console.log('rows[0]', rows[0]);

            User.update({ email: req.body.email }, { pass: newPassHashed }, {},
                function(err, data) {
                    if (err) return res.status(500).send({ result: "internal error in database: maybe this user doesn't exist?" });
                    var htmlEmail = '<b>Hello ' + rows[0].fullName + '</b> <p> Your new account settings are: </p>';
                    htmlEmail += '<p>Email: ' + req.body.email + '</p>';
                    htmlEmail += '<p>New password: ' + newPass + '</p>';
                    htmlEmail += '<p>Please change this password in "my profile" section</p>';

                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'rocio.3.romero@gmail.com', // Your email id
                            pass: 'Peeter3--' // Your password
                        }
                    });

                    var mailOptions = {
                        from: 'rocio.3.romero@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'Email Example', // Subject line
                        html: htmlEmail
                    };

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                            if (err) return res.status(500).send({ result: "internal error sending the email!" });
                        } else {
                            console.log('Message sent: ' + info.response);
                            return res.status(200).send({ result: "Password sent", data: info.response });
                        };
                    });


                })
        } else { // user doesn't exist
            res.status(499).send({ result: 'this email is not registered' })
            return;
        }
    })
});

// change password

router.put('/:id', function(req, res) {
    let filters = {};
    filters._id = req.params.id;
    console.log(req.body);
    User.list(filters, 'email', function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        if (rows.length !== 0) { // user found
            //check if password is correct
            let sha256 = crypto.createHash("sha256");
            sha256.update(req.body.currentPass, "utf8"); //utf8 here
            let passConHash = sha256.digest("base64");
            if (passConHash === rows[0].pass) { //change pass

                //hashear nueva pass
                let sha256 = crypto.createHash("sha256");
                sha256.update(req.body.newPass, "utf8"); //utf8 here
                let newPassHashed = sha256.digest("base64");

                User.update({ email: rows[0].email }, { pass: newPassHashed }, {},
                    function(err, data) {
                        if (err) return res.status(500).send({ result: "internal error in database: maybe this user doesn't exist?" });
                        return res.status(200).send({ result: 'pass changed', data: rows })
                    });
                
            } else {
                return res.status(401).send({ result: "Current pass not correct " })
            }
        } else { // user not found
            return res.status(404).send({ result: 'user not found' })
        }
    })
})


module.exports = router;
