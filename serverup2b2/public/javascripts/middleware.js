// middleware.js
var jwt = require('jwt-simple');  
var moment = require('moment');  
var config = require('../../config.js');

exports.ensureAuthenticated = function(req, res, next) {  
  console.log('estoy en ensureAuthenticated');
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({message: "The request doesn't have an authorization header"});
  }

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);

  if(payload.exp <= moment().unix()) {
     return res
        .status(401)
        .send({message: "The token has expired"});
  }

  req.user = payload.sub;
  next();
}
