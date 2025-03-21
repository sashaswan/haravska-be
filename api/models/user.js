const mongoose = require('mongoose');
const { user: messages } = require('../../config/messages');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  email: {
    type: String,
    validate: {
      validator: v =>  /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
      message: messages.email.invalid,
    },
    unique: true,
    required: [true, messages.email.required],
  },
  password: String,
  role: String,
});

module.exports = mongoose.model('Users', UserSchema);