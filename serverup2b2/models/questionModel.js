"use strict";

var conn = require('../lib/connectMongoose');

var mongoose = require('mongoose');


//Creo el esquema

var annSchema = mongoose.Schema({
	codigoPostal: Number,
	calle: String,
	ciudad: String,
	compra: Boolean,
	precio: Number,
	metros: Number,
	numeroHabitaciones: Number,
	amueblado: Boolean,
	descripcion: String,
	fechaSubida: String,
	usuarioSubida: String,
	fotos: [String]
});

// al esquema le metemos un estático
annSchema.statics.list = function(start, limit, filters, sort,  cb){

	// preparamos la query sin ejecutarla
	let query = Anuncio.find(filters);
	// añadimos más parámetros a la query
	if(limit != 0){
		query.limit(limit);
	}

	query.sort(sort);

	if(start != 0){
		query.skip(start);
	}

	// se ejecuta la query:
	query.exec(function(err, rows){
		if (err){
			cb(err);
			return;
		}
		cb(null, rows);
		return;
	});

};

// Al modelo le metemos el esquema
var Anuncio = mongoose.model('Anuncio', annSchema);

// Métodos del modelo
var anuncio = {
	getAnuncios: function(cb){
		// con Mongoose
		Anuncio.find({}, function(err, datos){
			if(err){
				cb(err);
				return;
			}
			cb(null, datos);
			return;
		});
	}
};

module.exports = anuncio; 