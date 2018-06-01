var User = require('../models/user');
var jwt = require('jsonwebtoken');

var secret = 'testing';

module.exports =function(router) {
 //http://localhost:8000/api/users
     //user registration
	router.post('/users',function(req,res){
		var user = new User();
		user.username=req.body.username;
		user.password=req.body.password;
		user.email=req.body.email;
		user.name=req.body.name;

		user.save(function(err){
			if(err){
				//console.log(err.errors.name);
				if (err.errors != null) {
                    if (err.errors.name) {
                        res.json({ success: false, message: err.errors.name.message }); // Display error in validation (name)
                    } else if (err.errors.email) {
                        res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                    } else if (err.errors.username) {
                        res.json({ success: false, message: err.errors.username.message }); // Display error in validation (username)
                    } else if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); // Display error in validation (password)
                    } else {
                        res.json({ success: false, message: err }); // Display any other errors with validation
                    }
                    } else if (err) {
                        // Check if duplication error exists
                        console.log(err);
                        if (err.code == 11000) {
                            if (err.errmsg[56] == "u") {
                                res.json({ success: false, message: 'That username is already taken' });
                            } else if (err.errmsg[56] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); 
                            }
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                    }
			}
			else {			
				res.json({ success: true, message: 'User created' });
			}
		});
	});

	//user login route
	//http://localhost:8000/api/authenticate
	router.post('/authenticate',function(req,res){

		User.findOne({ username: req.body.username }).select('email username password').exec(function(err,user){
			if(err) throw err;

			if(!user){
				res.json({ success: false, message: 'Could not authenticate user' });	
			}else if(user){
				
				var validPassword = user.comparePassword(req.body.password);
				
				if(!validPassword){
					res.json({ success: false, message: 'Could not authenticate password' });
				}
				else{
					var token = jwt.sign({ username: user.username, email: user.email },secret,{ expiresIn: '4h' });
					res.json({ success: true, message: 'User authenticated', token: token });
				}
			}
		});

	});

	router.use(function(req,res,next){

		var token = req.body.token || req.body.query || req.headers['x-access-token'];

		if(token){
			jwt.verify(token,secret,function(err,decoded){
				if(err){
					res.json({ success: false, message: 'Token Invalid' });
				}
				else{
					req.decoded = decoded;
					next();
				}	
			});				
		}
		else{
			res.json({ success: false, message: 'No Token Provided' });
		}
	});

	router.post('/me',function(req,res){
		res.send(req.decoded);			
	});

	return router;
}