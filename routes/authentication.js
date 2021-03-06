var express = require('express');
var router = express.Router();
var pg = require('pg');
//var bodyParser = require('body-parser');

//router.use(bodyParser.json()); // support json encoded bodies
//router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function isEmptyString(str) {
    return (!str || str.length === 0);
}

function isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

router.get('/', function(request, response){
	//var user_email = request.body.user_email;
	//var user_password = request.body.user_password;
	var user_email = request.query.user_email;
	var user_password = request.query.user_password;
	
	if(isEmptyString(user_email)){
		return response.send({'error': 'Email Missing'});
	}
	if(isEmptyString(user_password)){
		return response.send({'error': 'Password Missing'});
	}

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if(err){
			console.error(err);
			return response.send({'error': err});
		}
		client.query('SELECT * FROM user_table WHERE user_email = $1', [user_email] ,function(err, result) {
      		done();
      		if (err){ 
       			console.error(err); 
       			return response.send({'error': err});  //Is this the proper way to report an error
       		}
      		else{ 
      			if(result.rowCount == 0)
      				return response.send({'error': 'Invalid Username'});
      			else if(result.rowCount == 1 && result.rows[0].user_password === user_password)
      				return response.send(result.rows[0]);
      			else
      				return response.send({'error': 'Invalid Username or Password'});
      		}
    	});
  	});
	
});

module.exports = router;