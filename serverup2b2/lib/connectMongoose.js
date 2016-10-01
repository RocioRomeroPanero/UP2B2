'use strict';

var mongoose = require('mongoose');
var conn = mongoose.connection;//hereda de un eventEmitter
conn.on('error', console.error.bind(console, 'mongodb connection error:'));
conn.once('open', function() {
 console.info('Connected to mongodb.');
});
mongoose.connect('mongodb://localhost/UP2B2');