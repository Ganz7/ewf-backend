var express = require('express');
var router = express.Router();
var pg = require('pg');

router.get('/', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM user_table', function(err, result) {
      		done();
      		if (err)
       		{ 
       			console.error(err); 
       			response.send("Error " + err);  //Is this the proper way to report an error
       		}
      		else
      		{ 
      			response.send(result.rows);
      		}
    	});
  	});
})

module.exports = router;