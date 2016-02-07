var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res, next) {
  res.send('Hello World!');
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});

//**API JUnk**

var router = express.Router();


app.use('/api', router);

router.get('/update-route', function(req, res, next) {

  mapRequests(res.lat, res.lng, res.desiredDistance, function(err, markers) {
		//Check for error
		if (err) res.send(err);
		//Change this to do something else with markers
		else httpAsync(req.origin, markers);
	});

  function httpAsync(theUrl, data, callback)
  {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //var myArr = JSON.parse(xmlhttp.responseText);
            //myFunction(myArr);
        }
    };
    xmlhttp.open("POST", theUrl, true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(data);
  }

  /*httpGetAsync("http://undeadrunningrouter.elasticbeanstalk.com/api/update-route", function(res) {
    console.log("Debug: Attempting return data to frontend");
    console.log("Debug: res = " + res);
  });*/
});

app.listen(8081,function(){
    console.log("Started listening on port", 8081);
})
