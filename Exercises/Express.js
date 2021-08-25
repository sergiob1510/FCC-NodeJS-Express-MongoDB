//SETUP
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Middleware
app.use((req, res, next) => {
  var detailsString = req.method + ' ' + req.path + ' - ' + req.ip;
  console.log(detailsString);
  next();
});

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));

//GET methods
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/now', (req, res, next) => {
  req.time = new Date().toString();
  next();
}, function(req, res) {
  res.json({ "time" : req.time });
});

app.get('/json', (req, res) => {
  if (process.env.MESSAGE_STYLE === 'uppercase') {
    res.json({ "message" : "HELLO JSON"});
  } else {
    res.json({ "message": "Hello json" });
  };
});

app.get('/:word/echo', (req, res) => {
  res.json({ "echo" : req.params.word });
});

app.route('/name')
.get((req, res) => {
   var first = req.query.first;
   var last = req.query.last;
   res.json({name: first + ' ' + last});
 })
 .post((req, res) => {
   var first = req.body.first;
   var last = req.body.last;
   res.json({name: first + ' ' + last});
 });

console.log("Hello World")


































 module.exports = app;
