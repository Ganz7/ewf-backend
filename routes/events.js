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

		var event_status_result;

		// Filter the query by past events in the future
		client.query('SELECT * FROM event_status_table WHERE user_email = $1', [user_email],
			function(err, result) {
			if (err){ 
				console.error(err); 
				return response.send({'error': 'Internal Database Error'});
			}
			event_status_result = result.rows;
			console.log("Event Status Result");
			console.log(event_status_result);
		});

		//var users_list = [user_email];
		var events_list = [];

		client.query('SELECT A._event_id, A.user_email, A.event_location, A.event_start_time, A.event_end_time, A.event_info '
			+' FROM event_table A RIGHT JOIN friend_table B ON A.user_email = B.user_2 WHERE B.user_1 = \'$1\' OR'
			+' A.user_email = \'$1\' ORDER BY A.event_start_time DESC LIMIT $2', [user_email, row_count],
			function(err, result){
			if (err){ 
				console.error(err); 
				return response.send({'error': 'Internal Database Error'});
			}	

			return response.send({'result': result.rows, 'user_status_result': event_status_result});

		});

		/*

		client.query('SELECT * FROM friend_table where user_1 = $1', [user_email],
			function(err, result){
			if (err){ 
				console.error(err); 
				return response.send({'error': 'Internal Database Error'});
			}
			for (var i=0; i<result.rows.length; i++){
				users_list.push(result.rows[i].user_2);
			}

			console.log("User's list: " + users_list);

			for(var i = 0; i < users_list.length; i++){
			//for(var user_email in users_list){
				client.query('SELECT * FROM event_table WHERE user_email = $1 ORDER BY event_start_time DESC LIMIT $2', 
					[users_list[i], row_count] , function(err, result) {
					if (err){ 
						console.error(err); 
						return response.send({'error': 'Internal Database Error'});
					}
					console.log("For user " + users_list[i]);
					console.log(result.rows);

					events_list = events_list.concat(result.rows);
					console.log("events list now");
					console.log(events_list);
				});
			}
			return response.send({'result': events_list, 'user_status_result': event_status_result});

			*/
			
		});
	});
});

/* 
 *	Updates the status of a (user,event) pair (Attending/Not Attending)
 */
router.get('/user_event_status', function (request, response) {
	var user_email = request.query.user_email;
	var event_id = request.query.event_id;
	var status = request.query.status;

	if(helper.isEmptyString(user_email) || helper.isEmptyString(event_id)){
		return response.send({'error': 'Incomplete Request'});
	}

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if(err){
			console.error(err);
			return response.send({'error': "Internal Database Error"});
		}

		client.query('UPDATE event_status_table SET user_attendance=$3 WHERE event_id=$1 AND user_email=$2', 
			[event_id, user_email, status], function(err, result){
			if (err){ 
				console.error(err); 
				return response.send({'error': 'Internal Database Error'});
			}
			return response.send({'success': 'Successfuly added'})
		});
	});
});



module.exports = router;