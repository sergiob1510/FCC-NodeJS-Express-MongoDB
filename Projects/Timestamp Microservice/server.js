// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// solution

app.get("/api/:date?", (req, res) => {
  if (/^\d*$/.test(req.params.date)) {
    var userDate = new Date();
    userDate.setTime(req.params.date);
  } else if (req.params.date == null) {
    var userDate = new Date();
  } else {
    var userDate = new Date(req.params.date);
  };
  if (!userDate.getTime()) res.json({ "error" :  "Invalid Date" });
  res.json( { "unix" : userDate.getTime(), "utc" : userDate.toUTCString() });
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
