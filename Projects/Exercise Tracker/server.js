//Packages and initial setup
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
   extended: false
}));

//This should fix Date problems
app.set('json replacer', function (key, value) {
  if (this[key] instanceof Date) {
    value = this[key].toDateString();
  }
  return value;

});
//Models

const userSchema = require(__dirname + '/models/userSchema');
const {ObjectId} = require('mongodb'); 
//Routing

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//api_users POST and GET methods
app.route('/api/users')
.post(async (req, res) => {
  const newUser = new userSchema({
    username: req.body.username,
    _id: new ObjectId()
  });
  console.log(newUser);
  try {
    await newUser.save();
    console.log(`User ${req.body.username} generated`);
    res.json({"username" : newUser.username, "_id" : newUser._id });
  } catch (err) {
    console.log(`Error!!!: ${err}`)
  }
})
.get(async (req, res) => {
  userSchema.find({}, (err, users) => {
    res.json(users);
  });
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  if (!req.body.date) {
    req.body.date = new Date().toDateString();
  };
  await userSchema.findByIdAndUpdate(req.params._id, {$push: {"log": {description : req.body.description, duration: req.body.duration, date: new Date(req.body.date)}}}, {upsert: true, new: true}, (err, usr) => {
  if (err) return res.send(500, err);
  console.log('Exercise added');
  let position = usr.log.length-1;
  res.json({"_id": usr._id, "username" : usr.username, "date" : usr.log[position]["date"].toDateString(), "duration" : usr.log[position]["duration"], "description" : usr.log[position]["description"] });
  });
});

app.get('/api/users/:_id/logs', async (req, res) => {
  await userSchema.findById(req.params._id, (err, usr) => {
    if (req.query.from || req.query.to || req.query.limit) {
      if (!req.query.from) {
        req.query.from = '1970-01-01';
      }
      if (!req.query.to) {
        req.query.to = '2050-01-01';
      }
      let fromDate = new Date(req.query.from);
      let toDate = new Date(req.query.to);
      let log = usr.log.filter(exercise => fromDate <= exercise.duration <= toDate).slice(0, req.query.limit);
      console.log(log);
      log = log.map((obj) => {
        obj["date"] = obj["date"].toDateString();
        return obj;
      });
      res.json({"_id" : usr._id, "username" : usr.username, "count": usr.log.length,"log" : log});
    }
    else {
      let log = usr.log;
      log = log.map((obj) => {
        obj["date"] = obj["date"].toDateString();
        return obj;
      });
     res.json({"_id" : usr._id, "username" : usr.username, "count": usr.log.length, "log": log });
  }
  });
});

//DB Connection

mongoose.connect(process.env['DB_CONNECT'], { useNewUrlParser : true, useUnifiedTopology : true }, () => { console.log("DB connected");});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
