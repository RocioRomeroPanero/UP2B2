'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var crypto = require("crypto");
require('../../../models/userModel');
var User = mongoose.model('User'); // pido el modelo

var services = require('../../../public/javascripts/services');
var middleware = require('../../../public/javascripts/middleware');

// Get users

router.get('/', middleware.ensureAuthenticated,function(req, res) {

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

// get an user
router.get('/:id', middleware.ensureAuthenticated, function(req, res) {

    var sort = req.query.sort || 'email';

    var filters = {};

    filters._id = req.params.id;

    // como quiero obtener todos los usuarios, no introduzco filtro: {}
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

router.post('/newUser', middleware.ensureAuthenticated, function(req, res) {

    let user = {};
    var pass = req.body.pass;
    var email = req.body.email;
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

            let sha256 = crypto.createHash("sha256");

            sha256.update(req.body.pass, "utf8"); //utf8 here

            let passConHash = sha256.digest("base64");

            user.pass = passConHash;

            user.email = email;
            user.dni = req.body.dni;
            user.fullName = req.body.fullName;
            user.score = 0;
            user.degree = req.body.degree;
            user.tests = [];
            user.admin = req.body.admin;
            user.creationTime = Date.now();

            console.log('user', user);
            console.log('req.body', req.body);
            let user2 = new User(user); // creamos el objeto en memoria, aún no está en la base de datos

            user2.save(function(err, newRow) { // lo guardamos en la base de datos
                //newRow contiene lo que se ha guardado, la confirmación
                if (err) {
                    return res.status(500).send({ result: 'internal error in database', err: err })
                }
                res.status(200).send({ result: 'user created', row: newRow })
                return;
            });
        }
        return;
    });
});

// Login

router.post('/login', function(req, res) {

    // get user and check if exists in the database.
    var email = req.body.email;
    var pass = req.body.pass;
    var filters = {};

    filters.email = email;
    console.log('req.body', req.body);

    User.list(filters, 'email', function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        if (rows.length !== 0) { // user found
            //check if password is correct
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
        } else { // user not found
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

router.put('/userData/:id',middleware.ensureAuthenticated, function(req, res) {

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

// Modify an users score

/*router.put('/score/:id', function(req, res){

})*/

// Get ranking: habrá que recoger todos los usuarios y coger los scores + nombres


module.exports = router;
