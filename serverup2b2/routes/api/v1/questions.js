'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../../../models/questionModel');
var Question = mongoose.model('Question'); // pido el modelo


// get questions

// get question

router.get('/:id', function(req, res) {

	console.log(req.params);
	var filters = {};
    filters._id = req.params.id;

    Question.list(filters, 'question', function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        if (rows.length != 0) {
            return res.status(200).send({ result: 'sucess', rows: rows })
        } else {
            return res.status(404).send({ result: 'no question with this id' })
        }
    });
});



// add question

router.post('/newQuestion', function(req, res) {

    // question has: creationDate, question, answer1, answer2, answer3, answer4, 
    // correctAnswer, numberDone, numberCorrect, audio.

    var question = req.body;
    question.creationDate = Date.now();
    question.numberCorrect = 0;
    question.numberDone = 0;

    let question2 = new Question(question);

    question2.save(function(err, newRow) { // lo guardamos en la base de datos
        //newRow contiene lo que se ha guardado, la confirmación
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        res.status(200).send({ result: 'question created', row: newRow })
        return;
    });
});

module.exports = router;
