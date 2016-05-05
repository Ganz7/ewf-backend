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
			else{
				event_status_result = result.rows;
			}
		});

		var users_list = [user_email];

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
		});

		var events_list = [];

		for(var i = 0; i < users_list.length; i++){
			client.query('SELECT * FROM event_table WHERE user_email = $1 ORDER BY event_start_time DESC LIMIT $2', 
				[users_list[i], row_count] ,function(err, result) {
				if (err){ 
					console.error(err); 
					return response.send({'error': 'Internal Database Error'});
				}
				console.log("For user "+users_list[i]);
				console.log(result.rows);

				events_list.push(result.rows);
				//return response.send({'result':result.rows, 'user_status_result': event_status_result});
			});
		}
		done();
		return response.send({'result':events_list, 'user_status_result': event_status_result});
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