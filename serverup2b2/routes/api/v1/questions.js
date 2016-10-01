'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
require('../../../models/annModel');
var Anuncio = mongoose.model('Anuncio'); // pido el modelo

//var auth = require("../../../lib/auth");

//router.use(auth());  // esta ruta necesita autorización

// Se pueden obtener los anuncios con los siguientes filtros: código postal, localidad, compra/alquiler, precio, metros, amueblado o no, número de habitaciones, 

// También puedo obtener sólo mis favoritos o sólo mis anuncios.

// Además, le podemos pasar para la paginación: start (comenza por x elemento) y limit (número de elementos)

router.get('/', function(req, res) { 
	let sort = req.query.sort || 'name';
	let filters = {};
	let precio = {};
	let met = {};
	let hab = {};
	let start = 0;
	let limit = 0;

	// PARA LA PAGINACIÓN
	if(req.query.start != undefined){
		start = parseInt(req.query.start);
	}

	if(req.query.limit != undefined){
		limit = parseInt(req.query.limit);
	}

	// PARA LOS FILTROS

	console.log(req.query.id);
	if(req.query.id != undefined){
		filters._id = req.query.id;
	}

	if(req.query.usuarioSubida !=undefined){
		filters.usuarioSubida = req.query.usuarioSubida;
	}

	if(req.query.compra != undefined && (req.query.compra === 'false' || req.query.compra === 'true')){
		filters.compra = req.query.compra;
	}

	if(req.query.ciudad != undefined){
		filters.ciudad = req.query.ciudad;
	}
	if(req.query.codigoPostal != undefined){
		filters.codigoPostal = req.query.codigoPostal;
	}
	if(req.query.usuarioSubida != undefined){
		filters.usuarioSubida = req.query.usuarioSubida;
	}

	if(req.query.metros != undefined){

		// Hay que hacerlo como para el precio: igual, mayor o menor

		var metros = req.query.metros.split("-");

		if(metros[1]==""){ //x- Esto es para los metros mayores que el número dado
			met.$gte=metros[0];
		}

		if(metros[0]==""){//-x Esto es para los metros menores que el número dado
			met.$lte=metros[1];
		}

		if(metros[1] != "" && metros[0] != ""){ //x-y Esto es para un valor entre x e y
			met.$gte=metros[0];
			met.$lte=metros[1];
		}

		if(metros[1] == undefined){
			met = metros[0];
		}

		filters.metros=met;

	}

	if(req.query.numeroHabitaciones != undefined){
		var habit = req.query.numeroHabitaciones.split("-");

		if(habit[1]==""){ //x- Esto es para los metros mayores que el número dado
			hab.$gte=habit[0];
		}

		if(habit[0]==""){//-x Esto es para los metros menores que el número dado
			hab.$lte=habit[1];
		}

		if(habit[1] != "" && habit[0] != ""){ //x-y Esto es para un valor entre x e y
			hab.$gte=habit[0];
			hab.$lte=habit[1];
		}

		if(habit[1] == undefined){
			hab = habit[0];
		}

		filters.numeroHabitaciones=hab;
	}

	if(req.query.amueblado != undefined && (req.query.amueblado === 'false' || req.query.amueblado === 'true')){
		filters.amueblado = req.query.amueblado;
	}

	if(req.query.precio != undefined){

		var pre = req.query.precio.split("-");

		if(pre[1]==""){ //x-
			precio.$gte=pre[0];
		}

		if(pre[0]==""){//-x
			precio.$lte=pre[1];
		}

		if(pre[1] != "" && pre[0] != ""){ //x-y
			precio.$gte=pre[0];
			precio.$lte=pre[1];
		}

		if(pre[1] == undefined){
			precio=pre[0];
		}

		filters.precio=precio;

		}

	Anuncio.list(start, limit, filters, sort, function(err, rows){
		if(err){
			return res.json({result: false, err: 'Hay un error con la base de datos'});
		}
		res.json({result: true, rows: rows});
		return;
	});
});

// las fotos hay que pasarlas con comas, para así poder guardarlas en elementos diferentes del array

router.post('/', function(req, res) { 

	//Todos los elementos son obligatorios para añadir un anuncio

	if(req.body.codigoPostal == undefined || req.body.calle == undefined || req.body.ciudad == undefined || req.body.compra == undefined || req.body.precio == undefined || req.body.metros == undefined || req.body.numeroHabitaciones == undefined || req.body.amueblado == undefined || req.body.descripcion == undefined || req.body.usuarioSubida == undefined || req.body.fotos == undefined){
		return res.json({result: false, err: "Es necesario introducir todos los elementos al anuncio (codigo postal, calle, ciudad, compra o alquiler, precio, metros, numeroHabitaciones, amueblado, descripcion, fecha de subida, usuario que sube el anuncio, fotos)"});
	}

	let anuncioAgregar = {};

	// Coger los elementos a añadir del anuncio

	let currentDate = new Date().toISOString();

	anuncioAgregar.codigoPostal = req.body.codigoPostal;
	anuncioAgregar.calle = req.body.calle;
	anuncioAgregar.ciudad = req.body.ciudad;
	anuncioAgregar.compra = req.body.compra;
	anuncioAgregar.precio = req.body.precio;
	anuncioAgregar.metros = req.body.metros;
	anuncioAgregar.numeroHabitaciones = req.body.numeroHabitaciones;
	anuncioAgregar.amueblado = req.body.amueblado;
	anuncioAgregar.descripcion = req.body.descripcion;
	anuncioAgregar.fechaSubida = currentDate;
	anuncioAgregar.usuarioSubida = req.body.usuarioSubida;

	// las fotos llegan con comas, por tanto tenemos que separarlas para meterlas en la base de datos como elementos diferentes del array de fotos

	let separados = req.body.fotos.split(",");

	anuncioAgregar.fotos = separados;

	let anuncio = new Anuncio(anuncioAgregar); 

	anuncio.save(function(err, newRow) { // lo guardamos en la base de datos
                //newRow contiene lo que se ha guardado, la confirmación
                if (err) {
                    res.json({ result: false, err: 'Ha ocurrido un error con la base de datos' });
                    return;
                }
                res.json({ result: true, row: newRow });
                return;
            });
});


router.delete('/:id', function(req, res){
	Anuncio.remove({_id: req.params.id}, function(err){
		if(err) return res.json({result: false, err: 'No se ha podido eliminar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe'});
		res.json({result: true, resp: "Anuncio eliminado correctamente"});
		return;
	});

});


router.put('/:id', function(req, res){
	  Anuncio.update({ _id: req.params.id }, { $set: req.body }, {}, function(err, data) {
        if (err) {
            return res.json({ result: false, err: 'No se ha podido modificar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe' });
        }
        res.json({ result: true, row: 'Anuncio modificado correctamente' });
    });
});


module.exports = router;
