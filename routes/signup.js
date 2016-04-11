var express = require('express');
var router = express.Router();
var pg = require('pg');

function isEmptyString(str) {
    return (!str || str.length === 0);
}

router.get('/', function(request, response){
  var user_name = request.query.user_name;
	var user_email = request.query.user_email;
	var user_password = request.query.user_password;
	
	if(isEmptyString(user_name)){
    return response.send({'error': 'User Name Missing'});
  }
  if(isEmptyString(user_email)){
		return response.send({'error': 'Email Missing'});
	}
	if(isEmptyString(user_password)){
		return response.send({'error': 'Password Missing'});
	}

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if(err){
			console.error(err);
			return response.send({'error': "Internal Database Error"});
		}
		client.query('SELECT * FROM user_table WHERE user_email = $1', [user_email] ,function(err, result) {
      		//done();
      		if (err){ 
       			console.error(err); 
       			response.send({'error': "Internal Database Error"});
       		}
      		else{ 
      			if(result.rowCount > 0){
      				return response.send({'error': 'Email Already Exists'});
            }
            //Insert into user_table
      		}
    	});
  	});
	
});

module.exports = router;