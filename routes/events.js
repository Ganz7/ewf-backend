var express = require('express');
var router = express.Router();
var pg = require('pg');
var helper = require('../public/javascripts/helper.js')

router.get('/', function (request, response) {
	var user_email = request.query.user_email;
	var row_count = request.query.row_count;

	if(helper.isEmptyString(user_email)){
		return response.send({'error': 'Incomplete Request'});
	}

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if(err){
			console.error(err);
			return response.send({'error': err});
		}
		client.query('SELECT * FROM event_table WHERE user_email = $1 ORDER BY event_start_time DESC LIMIT $2', 
			[user_email, row_count] ,function(err, result) {
			if (err){ 
				console.error(err); 
				return response.send({'error': 'Internal Database Error'});
			}
			else{
				console.log("Successfuly Retrieved");
				return response.send({'result':result.rows});
			}
		});
	});
});

module.exports = router;