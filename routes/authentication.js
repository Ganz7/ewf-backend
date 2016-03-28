var express = require('express');
var router = express.Router();
var pg = require('pg');

router.post('/', function(request, response){
	var user_email = request.params.user_email;
	var user_password = request.params.user_password;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		
  	});
});