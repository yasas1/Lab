var express = require('express'); // ExperssJS Framework
var app = express(); // Invoke express to variable for use in application
var morgan = require('morgan'); // Import Morgan Package

var mongoose = require('mongoose'); // HTTP request logger middleware for Node.js

var bodyParser = require('body-parser');

var router = express.Router(); 
var appRoutes = require('./app/routes/api')(router);

var path=require('path');

app.use(morgan('dev')); // Morgan Middleware
app.use(bodyParser.json()); // Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); // Allow front end to access public folder
app.use('/api',appRoutes);

mongoose.connect('mongodb://localhost:27017/lab', function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err); // Log to console if unable to connect to database
    } else {
        console.log('Successfully connected to MongoDB'); // Log to console if able to connect to database
    }
});

app.get('*',function(req,res){
	res.sendFile(path.join(__dirname+ '/public/app/views/index.html'));
});

var port = process.env.PORT || 8000;
app.listen(port,function(){
	console.log("Running the server on port " + port);
});

/*app.get('/home',function(req,res){
    res.send("Hello from home")
});
app.get('/',function(req,res){
    res.send("Hello ")
}); */

/*

var passport = require('passport'); // Express-compatible authentication middleware for Node.js.
var social = require('./app/passport/passport')(app, passport); // Import passport.js End Points/API
*/
