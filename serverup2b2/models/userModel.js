"use strict";

var conn = require('../lib/connectMongoose');

var mongoose = require('mongoose');

let userSchema = mongoose.Schema({
	fullName: String,
	pass: String,
	email: String,
	tests: [String],
	score: Number,
	degree: String,
	admin: Boolean,
	dni: String

	// añadir fecha de creación
	
});

// al esquema le metemos un estático
userSchema.statics.list = function(filter, sort, cb){
	let sortAplicar = sort || "email";

	// preparamos la query sin ejecutarla
	let query = User.find(filter);
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

var User = mongoose.model('User', userSchema);