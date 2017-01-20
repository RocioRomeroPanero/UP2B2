'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../../../models/questionModel');
var middleware = require('../../../public/javascripts/middleware');
var Question = mongoose.model('Question'); // pido el modelo
var User = mongoose.model('User'); // pido el modelo
var fs = require('fs');

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
        //query = { $and:[{ test: true}, {usersCorrect: { $nin: [{ id: req.query.id }] } } ]};
        query = { $and: [{ test: true }, { 'usersCorrect.id': { $nin: req.query.id } }] };
    } else {
        console.log('paso por aqui === false');
        //query = { $and:[{ training: true}, {usersCorrect: { $nin: [{ id: req.query.id }] } }]};
        query = { $and: [{ training: true }, { 'usersCorrect.id': { $nin: req.query.id } }] };
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

    // Actualizar al usuario: req.body.user.id:
    // añadir la puntuación, y el testDone. Coger la puntuación que tiene ahora, y sumarle la recibida por el cliente

    var filters = {};
    filters._id = req.body.user.id;
    User.list(filters, 'email', function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }
        req.body.testDone.date = Date.now();
        /*SOLO SI ES DE TIPO*/
        // nueva puntuación para actualizar al usuario 
        if (req.body.testDone.training == false) {
            if (rows[0].score != 100) {

            }
            var newScore = rows[0].score + req.body.score;
            if (newScore > 100) {
                newScore = 100;
            } else if (newScore < -100) {
                newScore = -100;
            }
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

                })

            }

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

    // coger los archivos que tiene adjunta la pregunta y eliminarlos
    var filters = {};
    filters._id = req.params.id;
    Question.list(filters, 'question', null, function(err, rows) {
        if (err) {
            return res.status(500).send({ result: 'internal error in database', err: err })
        }

        // eliminar los archivos adjuntos y luego eliminar la pregunta de la base de datos
        
        //fs.unlinkSync('../../../public/files/'+);
        for (var i = 0; i < rows[0].files.length; i++) {
            console.log('elimino el ' + i);
            console.log('nombre del archivo ', rows[0].files[i]);
            fs.unlinkSync(req.app.get('files') + '\\' + rows[0].files[i]);
        }
        console.log('elimino la pregunta lo último');
        Question.remove({ _id: req.params.id }, function(err) {
            if (err) return res.status(500).send({ result: "internal error in database: maybe this question doesn't exist?" })
            return res.status(200).send({ result: "question deleted" })
        });
    })


    /*Question.remove({ _id: req.params.id }, function(err) {
        if (err) return res.status(500).send({ result: "internal error in database: maybe this question doesn't exist?" })
        return res.status(200).send({ result: "question deleted" })
    });*/


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
    question.answer1 = req.body.answer1 || "";
    question.answer2 = req.body.answer2 || "";
    question.answer3 = req.body.answer3 || "";
    question.answer4 = req.body.answer4 || "";
    question.correctAnswer = req.body.correctAnswer || 0;
    question.question = req.body.question || "";
    question.numberCorrect = 0;
    question.userDone = [];
    question.usersCorrect = [];
    question.test = req.body.test;
    question.training = req.body.training;
    question.timeToAnswer = req.body.timeToAnswer;
    question.files = req.body.files || [];

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
