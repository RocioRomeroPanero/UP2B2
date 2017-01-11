'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../../../models/questionModel');
var middleware = require('../../../public/javascripts/middleware');
var Question = mongoose.model('Question'); // pido el modelo


// get questions

router.get('',  middleware.ensureAuthenticated, function(req,res){
    Question.list({}, 'question', null,function(err, rows){
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        if (rows.length != 0) {
            return res.status(200).send({ result: 'sucess', rows: rows })
        } else {
            return res.status(404).send({ result: 'not questions yet created' })
        }
    })

});

// get test for user

router.get('/test/:id?:test', function(req,res){
    var filters = {};

    // en ?:test irá true si es para test o false si es para training

    var query = {usersCorrect: {$nin: [req.params.id]}};

    if(req.params.test === true){
        query.test = true;
    }else{
        query.training = true;
    }

    // get questions that don't have the id of the user in usersCorrect.
    Question.list(query, 'question', {limit:10}, function(err, rows){
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        else{
            return res.status(200).send({ result: 'sucess', rows: rows })
        }
    })
});

// get question by id

router.get('/:id',  middleware.ensureAuthenticated, function(req, res) {

    var filters = {};
    filters._id = req.params.id;

    Question.list(filters, 'question', null, function(err, rows) {
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

// delete question

router.delete('/:id', middleware.ensureAuthenticated, function(req, res) {
    Question.remove({ _id: req.params.id }, function(err) {
        if (err) return res.status(500).send({ result: "internal error in database: maybe this question doesn't exist?" })
        return res.status(200).send({ result: "question deleted" })
    });
});

// put question

router.put('/:id', middleware.ensureAuthenticated,  function(req, res){
    var filters = {};

    filters._id = req.params.id;

    Question.findByIdAndUpdate(req.params.id, req.body, {}, function(err, data) {
        if (err) return res.status(500).send({ result: "internal error in database: maybe this question doesn't exist?" })
        return res.status(200).send({ result: "question modified", data: data });
    })

});

// add question

router.post('/newQuestion',  middleware.ensureAuthenticated, function(req, res) {

    console.log('req.body', req.body);

    var question = {};
    question.creationDate = Date.now();
    question.numberCorrect = 0;
    question.numberDone = 0;
    question.answer1 = req.body.answer1;
    question.answer2 = req.body.answer2;
    question.answer3 = req.body.answer3;
    question.answer4 = req.body.answer4;
    question.correctAnswer = req.body.correctAnswer;
    question.question = req.body.question;
    question.numberDone = 0;
    question.numberCorrect = 0;
    question.userDone = [];
    question.usersCorrect = [];
    question.test = req.body.test;
    question.training = req.body.training;
    question.timeToAnswer = req.body.timeToAnswer;

    let questionToSave = new Question(question);

    questionToSave.save(function(err, newRow) { // lo guardamos en la base de datos
        //newRow contiene lo que se ha guardado, la confirmación
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        return res.status(200).send({ result: 'question created', row: newRow });
    });
});

module.exports = router;
