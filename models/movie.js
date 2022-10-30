const mongoose = require('mongoose');
const { REGEX_PATTERN } = require('../constants/patterns');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: { // Валидация корректности ссылки на уровне схемы
      validator(v) {
        return REGEX_PATTERN.url.test(v);
      },
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: { // Валидация корректности ссылки на уровне схемы
      validator(v) {
        return REGEX_PATTERN.url.test(v);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: { // Валидация корректности ссылки на уровне схемы
      validator(v) {
        return REGEX_PATTERN.url.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
