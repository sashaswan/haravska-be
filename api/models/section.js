const mongoose = require('mongoose');
const { section: messages } = require('../../config/messages');
const { Schema } = mongoose;

const SectionsSchema = new Schema({
  type: {
    type: String,
    enum: ['title', 'section'],
    required: [true, messages.required.title],
  },
  title: String,
  photos: [{
    type: String,
  }]
});

module.exports = mongoose.model('Sections', SectionsSchema);