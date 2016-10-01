'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var crypto = require("crypto");
require('../../../models/userModel');
var User = mongoose.model('User'); // pido el modelo

router.get('/', function(req, res) {

    var sort = req.query.sort || 'name';

    var filters = {};

    console.log("req.query.name", req.query.name);

    if (req.query.name != undefined) {
        filters.name = req.query.name;
    }
    console.log("filters", filters);
    // como quiero obtener todos los usuarios, no introduzco filtro: {}
    User.list(filters, sort, function(err, rows) {
        if (err) {
            return res.json({ result: false, err: err });
        }
        if (rows.length != 0) {
            return res.json({ result: true, rows: rows });
        } else {
            return res.json({ result: false, err: 'No existe este usuario' })
        }

    });
});

//llamarlo con name y pass
router.post('/', function(req, res) {

    var authentic = req.body.authentic;

    //quiero poner el hash a la pass primero, y luego ya guardar lo obtenido
    var usuario = {};
    var pass = req.body.pass;
    let filters = {};
    filters.name = req.body.name;
    //comprobar si existe ese nombre en la base de datos primero!

    User.list(filters, 'name', function(err, rows) {
        if (err) {
            res.json({ result: false, err: err });
            return;
        }
        if (rows.length !== 0) {
            if (authentic === 'true') {
                if (rows[0].name === req.body.name) { //coincide el nombre, ahora comprobar la contraseña, que ya me viene hasheada
                    let sha256 = crypto.createHash("sha256");
                    sha256.update(req.body.pass, "utf8"); //utf8 here
                    let passConHash = sha256.digest("base64");
                    if (passConHash === rows[0].pass) {
                        return res.json({ result: true, rows: rows[0] })
                    }
                    return res.json({ result: false, err: "La contraseña o el nombre de usuario no coinciden" })
                }
                return res.json({ result: false, err: "La contraseña o el nombre de usuario no coinciden (2)" })
            } else {
                res.json({ result: false, err: "El usuario ya está registrado" });
                return;
            }
        } else {
            if (authentic === 'true') {
                return res.json({ result: false, err: "El usuario no se encuentra en la base de datos" })
            }
            let sha256 = crypto.createHash("sha256");
            sha256.update(pass, "utf8"); //utf8 here
            let passConHash = sha256.digest("base64");
            usuario.pass = passConHash;
            usuario.email = req.body.email;
            usuario.phone = req.body.phone;
            usuario.name = req.body.name;
            usuario.myAnn = [];
            usuario.myFav = [];
            let user = new User(usuario); // creamos el objeto en memoria, aún no está en la base de datos

            user.save(function(err, newRow) { // lo guardamos en la base de datos
                //newRow contiene lo que se ha guardado, la confirmación
                if (err) {
                    res.json({ result: false, err: err });
                    return;
                }
                res.json({ result: true, row: newRow });
                return;
            });
        }
        return;
    });
});

// para modificar el usuario (en una primera versión, sólo podré modificar los valores de mis anuncios y mis favoritos): me tienen que pasar el usuario (id del usuario) y los nuevos valores a modificar

router.put('/:id', function(req, res) {
    var options = {};

    var opt = false;

    if (req.body.options != undefined) {
        opt = true;
    }

    console.log('req.body', req.body);
    User.findOne({ _id: req.params.id }, function(err, rows) {
        if (err) {
            return res.json({ result: false, err: err }); // error en la base de datos
        }
        if (rows == null) { //no existe este usuario
            return res.json({ result: false, err: "El usuario no existe (el id pasado no corresponde con ningun usuario" })
        } else { // sí que existe este usuario
            console.log('rows', rows);
            if (opt == false) {
                User.update({ _id: req.params.id }, { $push: req.body }, options, function(err, data) {
                    if (err) {
                        return res.json({ result: false, err: err });
                    }
                    return res.json({ result: true, row: data });
                });
            }
            if (opt == true) {
                User.update({ _id: req.params.id }, { $pull: req.body }, options, function(err, data) {
                    if (err) {
                        return res.json({ result: false, err: err });
                    }
                    return res.json({ result: true, row: data });
                })
            }

        }
    });
});

router.delete('/:id', function(req, res) {
    let nombre = req.params.nombre;
    User.remove({ _id: req.params.id }, function(err) {
        if (err) return res.json({ result: false, err: 'No se ha podido eliminar el usuario (ha ocurrido un problema en la base de datos, o el usuario no existe' });
        res.json({ result: true, resp: "Usuario eliminado correctamente" });
        return;
    });
});

module.exports = router;