var express = require('express');
var router = express.Router();
var pg = require('pg');
//var bodyParser = require('body-parser');

//router.use(bodyParser.json()); // support json encoded bodies
//router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function isEmpty(str) {
    return (!str || 0 === str.length);
}

router.get('/', function(request, response){
	//var user_email = request.body.user_email;
	//var user_password = request.body.user_password;
	var user_email = request.query.user_email;
	var user_password = request.query.user_password;
	
	if(isEmpty(user_email)){
		response.send("Error: Email Missing");
	}
	if(isEmpty(user_password)){
		response.send("Error: Password Missing");
	}

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM user_table WHERE user_email = $1', [user_email] ,function(err, result) {
      		done();
      		if (err)
       		{ 
       			console.error(err); 
       			response.send("Error " + err);  //Is this the proper way to report an error
       		}
      		else
      		{ 
      			console.log(result.rows);
      			response.send(result.rows);
      		}
    	});
  	});
	
});

module.exports = router;