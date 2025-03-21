const mongoose = require('mongoose');
const { photoSession: messages } = require('../../config/messages');
const { Schema } = mongoose;

const PhotoSessionsSchema = new Schema({
  title: {
    type: String,
    required: [true, messages.required.title],
  },
  category: {
    required: [true, messages.required.category],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
  },
  slider: [{
    type: String,
  }],
  model: String,
  agency: String,
  mua: String,
  style: String,
  designer: String,
  name: String,
  archived: {
    type: Boolean,
    default: false,
  },
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sections',
  }],
});

module.exports = mongoose.model('PhotoSessions', PhotoSessionsSchema);