'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var crypto = require("crypto");
require('../../../models/userModel');
var User = mongoose.model('User'); // pido el modelo

// Get users

router.get('/', function(req, res) {

    var sort = req.query.sort || 'email';

    var filters = {};

    console.log("filters", filters);
    // como quiero obtener todos los usuarios, no introduzco filtro: {}
    User.list(filters, sort, function(err, rows) {
        if (err) {
            return res.status(500).send({result: 'internal error in database', err: err})
        }
        if (rows.length != 0) {
            return res.status(200).send({result: 'sucess', rows: rows})
        } else {
            return res.status(404).send({result: 'no users yet'})
        }

    });
});

// get an user
router.get('/:id', function(req, res) {

    var sort = req.query.sort || 'email';

    var filters = {};

    filters._id  = req.params.id;

    // como quiero obtener todos los usuarios, no introduzco filtro: {}
    User.list(filters, sort, function(err, rows) {
        if (err) {
            return res.status(500).send({result: 'internal error in database', err: err})
        }
        if (rows.length != 0) {
            return res.status(200).send({result: 'sucess', rows: rows})
        } else {
            return res.status(404).send({result: 'no user with this id'})
        }

    });
});

// New user

router.post('/newUser', function(req, res) {

    let user = {};
    var pass = req.body.pass;
    var email = req.body.email
    let filters = {};
    filters.email = email;
    //comprobar si existe ese nombre en la base de datos primero!
    User.list(filters, 'email', function(err, rows) {
        if (err) {
            res.status(500).send({result: 'internal error in database', err: err})
            return;
        }
        if (rows.length !== 0) { // user already exists
                res.status(499).send({result: 'user with this email already exists'})
                return;
        } else { // user doesn't exist, lets create it

            let sha256 = crypto.createHash("sha256");

            sha256.update(req.body.pass, "utf8"); //utf8 here

            let passConHash = sha256.digest("base64");

            user.pass = passConHash;

            user.email = email;

            user.fullName = req.body.name;
            user.score = 0;
            user.degree = req.body.degree;
            user.tests = [];
            user.admin = req.body.admin;
            let user2 = new User(user); // creamos el objeto en memoria, aún no está en la base de datos

            user2.save(function(err, newRow) { // lo guardamos en la base de datos
                //newRow contiene lo que se ha guardado, la confirmación
                if (err) {
                    return res.status(500).send({result: 'internal error in database', err: err})
                }
                res.status(200).send({result: 'user created', row: newRow})
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
            return res.status(500).send({result: 'internal error in database', err: err})
        }
        if (rows.length !== 0) { // user found
            //check if password is correct
            let sha256 = crypto.createHash("sha256");
            sha256.update(pass, "utf8"); //utf8 here
            let passConHash = sha256.digest("base64");
            if (passConHash === rows[0].pass) {
                return res.status(200).send({result: 'sucess login'})  
            }
            else{
                return res.status(401).send({result: "user and pass doesn't match"})
            }
        } else { // user not found
            return res.status(404).send({result: 'user not found'})
            
        }
    })
});

// Delete an user

router.delete('/:id', function(req, res) {
    User.remove({ _id: req.params.id }, function(err) {
        if (err) return res.status(500).send({result: "internal error in database: maybe this user doesn't exist?"})
        return res.status(200).send({result: "user deleted"})
    });
});

// Modify an user

router.put('/:id', function(req, res){

    var filters = {};

    filters._id  = req.params.id;

    // en update va lo que quiero modificar, es decir, req.body

    User.findByIdAndUpdate(req.params.id, [update], req.body, function(err, data){
        if (err) return res.status(500).send({result: "internal error in database: maybe this user doesn't exist?"})
    })

})

module.exports = router;
