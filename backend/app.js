var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//**API JUnk**

var router = express.Router();


app.use('/api', router);

router.get('/update-route', function(req, res) {

});

app.listen(8000,function(){
    console.log("Started listening on port", 8000);
})
