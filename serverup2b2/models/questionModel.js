"use strict";

var conn = require('../lib/connectMongoose');
var mongoose = require('mongoose');
var thumbnailPluginLib = require('mongoose-thumbnail');
var thumbnailPlugin = thumbnailPluginLib.thumbnailPlugin;
var make_upload_to_model = thumbnailPluginLib.make_upload_to_model;
var path = require('path');
var uploads_base = path.join(__dirname, "uploads");
var uploads = path.join(uploads_base, "u");

let QuestionSchema = mongoose.Schema({
	creationDate: Date,
	question: String, // enunciado: String
	answer1: String,
	answer2: String,
	answer3: String,
	answer4: String,
	correctAnswer: String,// respuesta correcta: string
	numberDone: Number,// veces respondida
	numberCorrect: Number// veces acertada	
});

QuestionSchema.plugin(thumbnailPlugin, {
	name: 'audio',
	format: 'mp3',
	size: 80,
	inline: false,
	save: true,
	upload_to: make_upload_to_model(uploads, 'audios'),
	relative_to: uploads_base
});

// al esquema le metemos un estático
QuestionSchema.statics.list = function(filter, sort, cb){
	//let sortAplicar = sort || "email";

	// preparamos la query sin ejecutarla
	let query = Question.find(filter);

	// añadimos más parámetros a la query
	//query.sort(sortAplicar);

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