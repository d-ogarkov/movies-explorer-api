const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { TYPE } = require('../constants/types');

const urlValidationMethod = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Передана ошибочная ссылка');
};

const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const updateUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidationMethod),
    trailerLink: Joi.string().required().custom(urlValidationMethod),
    thumbnail: Joi.string().required().custom(urlValidationMethod),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: TYPE.mongooseObjectId,
  }),
});

module.exports = {
  createUserValidator,
  loginValidator,
  updateUserValidator,
  createMovieValidator,
  deleteMovieValidator,
};
