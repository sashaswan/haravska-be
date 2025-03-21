const mongoose = require('mongoose');
const { category: messages } = require('../../config/messages');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  title: {
    type: String,
    required: [true, messages.required.title],
  },
  photoSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhotoSessions',
  }]
});

module.exports = mongoose.model('Categories', CategorySchema);