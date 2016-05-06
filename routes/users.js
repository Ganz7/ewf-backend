var express = require('express');
var router = express.Router();
var helper = require('../public/javascripts/helper.js')

/* GET users listing. */
router.get('/', function(reqest, response) {
	var user_email = request.query.user_email;

	if(helper.isEmptyString(user_email)){
		return response.send({'error': 'Incomplete Request'});
	}

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if(err){
			console.error(err);
			return response.send({'error': err});
		}

		client.query('SELECT A.user_email, A.user_name FROM user_table A LEFT JOIN friend_table B ON A.user_email = B.user_2 WHERE B.user_1=$1',
		 [user_email], function(err, result){
			if (err){ 
				console.error(err); 
				return response.send({'error': 'Internal Database Error'});
			}

			return response.send({'result': result.rows});
		});
	});
});

module.exports = router;
