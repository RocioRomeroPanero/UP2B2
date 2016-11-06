"use strict";

var conn = require('../lib/connectMongoose');

var mongoose = require('mongoose');

let QuestionSchema = mongoose.Schema({
	// fecha creación: Date
	// enunciado: String
	// respuestas: []
	// respuesta correcta: string
	// audio: ¿?
	// veces respondida
	// veces acertada
});

// al esquema le metemos un estático
QuestionSchema.statics.list = function(filter, sort, cb){
	//let sortAplicar = sort || "email";

	// preparamos la query sin ejecutarla
	let query = Question.find(filter);

	// añadimos más parámetros a la query
	query.sort(sortAplicar);

	// se ejecuta la query:
	query.exec(function(err, rows){
		if (err){
			cb(err);
			return;
		}
		cb(null,rows);
		return;
	});

};

var Question = mongoose.model('Question', QuestionSchema);