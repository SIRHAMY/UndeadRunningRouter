var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mapRequests = require('./lib/mapRequests.js').mapRequests;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//**API JUnk**

var router = express.Router();


app.use('/api', router);

router.get('/update-route', function(req, res) {
	// alert("Teesting in progress");
	var lat = 30.44;
	var lng = -84.29;
	var desiredDistance = 10;
	mapRequests(lat, lng, desiredDistance, function(err, markers) {
		//Check for error
		if (err) res.send(err);
		//Change this to do something else with markers
		else res.send(markers);
	});
});

app.listen(8000,function(){
    console.log("Started listening on port", 8000);
})
