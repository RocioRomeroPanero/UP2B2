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
	photo: String,
	withPicture: Boolean,
	question: String, // enunciado: String
	answer1: String,
	answer2: String,
	answer3: String,
	answer4: String,
	correctAnswer: String,// respuesta correcta: string
	numberDone: Number,// veces respondida
	numberCorrect: Number,// veces acertada	
	usersDone: [String],
	usersCorrect: [String], 
	training: Boolean,
	test: Boolean,
	timeToAnswer: Number
});

// al esquema le metemos un estático
QuestionSchema.statics.list = function(filter, sort, limits, cb){
	
	// preparamos la query sin ejecutarla
	let query = Question.find(filter);

	if(limits != null){
		//query.options.skip = limits.skip;
		query.options.limit = limits.limit;
	}
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