'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../../../models/questionModel');
var middleware = require('../../../public/javascripts/middleware');
var Question = mongoose.model('Question'); // pido el modelo
var User = mongoose.model('User'); // pido el modelo


// get questions

router.get('', middleware.ensureAuthenticated, function(req, res) {
    Question.list({}, 'question', null, function(err, rows) {
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

router.get('/test', middleware.ensureAuthenticated, function(req, res) {
    var filters = {};

    // en ?:test irá true si es para test o false si es para training

    var query = {};
    console.log('req.query.test', req.query.test);
    if (req.query.test === 'true') {
        console.log('paso por aqui === true');
        query = { test: true, usersCorrect: { $nin: [{ id: req.query.id }] } };
    } else {
        console.log('paso por aqui === false');
        query = { training: true, usersCorrect: { $nin: [{ id: req.query.id }] } };
    }

    // get questions that don't have the id of the user in usersCorrect.
    Question.list(query, 'question', { limit: 10 }, function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        } else {
            console.log(rows);
            return res.status(200).send({ result: 'sucess', rows: rows })
        }
    })
});

router.post('/test/resolve', middleware.ensureAuthenticated, function(req, res) {

    console.log('req.body', req.body);
    // LO QUE RECIBO DEL CLIENTE EN REQ.BODY.
    /*var enviarServer = {
        score: 0,
        user: {
            email: userEmail,
            id: userId
        },
        testDone: {
            timeSpent: tiempoTotal - tiempoRestante,
            score: 0,
            numberCorrect: 0,
            numberWrong: 0,
            timeBonus: false
        },
        usersDone: [] // ids de las preguntas hechas
    };
    */

    // Actualizar al usuario: req.body.user.id:
    // añadir la puntuación, y el testDone. Coger la puntuación que tiene ahora, y sumarle la recibida por el cliente

    var filters = {};
    filters._id = req.body.user.id;
    User.list(filters, 'email', function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }

        /*SOLO SI ES DE TIPO*/
        // nueva puntuación para actualizar al usuario 
        if (req.body.testDone.training == false) {
            var newScore = rows[0].score + req.body.score;
            var updatingUser = {
                score: newScore,
                $push: { testDone: req.body.testDone }
            }
        } else {
            var updatingUser = {
                $push: { testDone: req.body.testDone }
            }
        }

        User.findByIdAndUpdate(req.body.user.id, updatingUser, {}, function(err, data) {
            if (err) return res.status(500).send({ result: 'internal error in database', err: err })
            var updatingQuestion = {};
            // modificar cada pregunta 
            var updatingQuestions = [];
            for (var i = 0; i < req.body.usersDone.length; i++) {
                // para cada pregunta hecha, tengo que añadir en usersDone y la info de req.body.user
                // si ese id está en usersCorrect, también tengo que añadir la info de req.body.user a usersCorrect.
                var idQuestion = req.body.usersDone[i];
                // si req.body.usersDone[i].correct == true -> meterla en users done y en users correct
                // == false -> solo meterla en users done
                console.log('req.body.usersDone[i]' + ' i=' + i, req.body.usersDone[i]);
                if (req.body.usersDone[i].correct == true) {
                    updatingQuestion = {
                        $push: { usersDone: req.body.user, usersCorrect: req.body.user }
                    }
                } else {
                    updatingQuestion = {
                        $push: { usersDone: req.body.user }
                    }
                }
                Question.findByIdAndUpdate(req.body.usersDone[i].id, updatingQuestion, {}, function(err, data) {
                    console.log('meh');
                })

                updatingQuestions.push(updatingQuestion);
            }
            console.log('updatingQuestions', updatingQuestions);

            return res.status(200).send({ result: "test done" });
        })


        /* console.log('resultado', rows);
        return res.status(200).send({ result: 'sucess' })
*/
    });


});

// get question by id

router.get('/:id', middleware.ensureAuthenticated, function(req, res) {

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

router.put('/:id', middleware.ensureAuthenticated, function(req, res) {
    var filters = {};

    filters._id = req.params.id;

    Question.findByIdAndUpdate(req.params.id, req.body, {}, function(err, data) {
        if (err) return res.status(500).send({ result: "internal error in database: maybe this question doesn't exist?" })
        return res.status(200).send({ result: "question modified", data: data });
    })

});

// add question

router.post('/newQuestion', middleware.ensureAuthenticated, function(req, res) {

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
