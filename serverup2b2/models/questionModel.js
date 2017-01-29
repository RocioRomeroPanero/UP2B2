"use strict";

var conn = require('../lib/connectMongoose');
var mongoose = require('mongoose');

var path = require('path');

let QuestionSchema = mongoose.Schema({
    creationDate: Date,
    files: [String],
    withPicture: Boolean,
    question: String, // enunciado: String
    answer1: String,
    answer2: String,
    answer3: String,
    answer4: String,
    correctAnswer: String, // respuesta correcta: string
    usersDone: [{
        id: String,
        email: String,
        training: Boolean
    }],
    usersCorrect: [{
        id: String,
        email: String,
        training: Boolean
    }],
    training: Boolean,
    test: Boolean,
    timeToAnswer: Number
});

// al esquema le metemos un estático
QuestionSchema.statics.list = function(filter, sort, limits, cb) {

    // preparamos la query sin ejecutarla
    let query = Question.find(filter);

    if (limits != null) {
        //query.options.skip = limits.skip;
        query.options.limit = limits.limit;
    }
    // se ejecuta la query:
    query.exec(function(err, rows) {
        if (err) {
            cb(err);
            return;
        }
        cb(null, rows);
        return;
    });
};

var Question = mongoose.model('Question', QuestionSchema);
