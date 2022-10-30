const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { REGEX_PATTERN } = require('../constants/patterns');
const { TYPE } = require('../constants/types');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REGEX_PATTERN.url),
    trailerLink: Joi.string().required().pattern(REGEX_PATTERN.url),
    thumbnail: Joi.string().required().pattern(REGEX_PATTERN.url),
    owner: TYPE.mongooseObjectId,
    movieId: TYPE.mongooseObjectId,
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: TYPE.mongooseObjectId,
  }),
}), deleteMovie);

module.exports = router;
