const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  _id: {
    type: String
  },
  log: [{
  description: {
    type: String
  },
  duration: {
    type: Number
  },
  date: {
    type: Date,
  }
  }]
});

module.exports = mongoose.model('userSchema', userSchema);