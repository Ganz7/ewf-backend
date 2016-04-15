var express = require('express');
var router = express.Router();
var pg = require('pg');

function isEmptyString(str) {
    return (!str || str.length === 0);
}

router.get('/event', function (request, response) {

	var user_email = request.query.user_email;
	var event_location = request.query.event_location;
	var event_date = request.query.event_date;
	var event_start_time = request.query.event_start_time;
	var event_end_time = request.query.event_end_time;
	var event_info = request.query.event_info;

	if(isEmptyString(user_email) || isEmptyString(event_location) || isEmptyString(event_date)
		|| isEmptyString(event_start_time) || isEmptyString(event_end_time)){
		return response.send({'error': 'Incomplete Request'});
	}

	client.query('INSERT INTO user_table VALUES ($1, $2, $3)', [user_name, user_email, user_password], function(err, result){
		done();
		if (err){ 
			console.error(err); 
			return response.send({'error': 'Internal Database Error'});
		}
		else{
			console.log("Successful Insertion");
			return response.send({'success': 'New Account Created', 'user_name': user_name, 'user_email': user_email});
		}
    });

}


module.exports = router;