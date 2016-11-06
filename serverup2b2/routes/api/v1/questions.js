'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
require('../../../models/questionModel');
var Question = mongoose.model('Question'); // pido el modelo

module.exports = router;
