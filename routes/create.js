var express = require('express');
var router = express.Router();
var pg = require('pg');

function isEmptyString(str) {
    return (!str || str.length === 0);
}

router.get('/event', function (request, response) {

	var user_email = request.query.user_email;
	var event_location = request.query.event_location;
	var event_start_time = request.query.event_start_time;
	var event_end_time = request.query.event_end_time;
	var event_info = request.query.event_info;

	if(isEmptyString(user_email) || isEmptyString(event_location) || isEmptyString(event_start_time) 
		|| isEmptyString(event_end_time)){
		return response.send({'error': 'Incomplete Request'});
	}

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if(err){
			console.error(err);
			return response.send({'error': err});
		}
		client.query('INSERT INTO event_table(user_email, event_location, event_start_time, event_end_time, event_info) VALUES ($1, $2, $3, $4, $5) RETURNING _event_id', 
			[user_email, event_location, event_start_time, 
			event_end_time, event_info], function(err, result){
			done();
			if (err){ 
				console.error(err); 
				return response.send({'error': 'Internal Database Error'});
			}
			else{
				console.log("Successful Insertion");
				console.log(result);
				return response.send({'success': 'Event Added', 'user_email': user_email, '_event_id': user_email});
			}
	    });
	});
});


module.exports = router;