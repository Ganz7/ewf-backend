var express = require('express');
var router = express.Router();
var pg = require('pg');
//var bodyParser = require('body-parser');

//router.use(bodyParser.json()); // support json encoded bodies
//router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function isEmpty(str) {
    return (!str || str.length === 0);
}

router.get('/', function(request, response){
	//var user_email = request.body.user_email;
	//var user_password = request.body.user_password;
	var user_email = request.query.user_email;
	var user_password = request.query.user_password;
	
	if(isEmpty(user_email)){
		return response.send("Error: Email Missing");
	}
	if(isEmpty(user_password)){
		return response.send("Error: Password Missing");
	}

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if(err){
			console.error(err);
			return response.send("Error " + err);
		}
		client.query('SELECT * FROM user_table WHERE user_email = $1', [user_email] ,function(err, result) {
      		done();
      		if (err){ 
       			console.error(err); 
       			response.send("Error " + err);  //Is this the proper way to report an error
       		}
      		else{ 
      			if(result.rows[0].user_password === user_password)
      				return response.send(result.rows);
      			else
      				return response.send("Error: Invalid User Name or Password");
      		}
    	});
  	});
	
});

module.exports = router;