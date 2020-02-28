const mongoose = require('mongoose');

/**
* Word Schema
* @private
*/
const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  collection: 'Word',
  timestamps: true,
});

wordSchema.statics = {

};

/**
* @typedef Word
*/
const Word = mongoose.model('Word', wordSchema);
module.exports = Word;
