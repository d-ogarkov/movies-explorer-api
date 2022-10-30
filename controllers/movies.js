const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden');
const ValidityError = require('../errors/validity');
const { ERROR_TYPE, MESSAGE_TYPE } = require('../constants/errors');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  const owner = req.user._id;
  Movie.create({ country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN, owner })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity) {
        return next(new ValidityError(MESSAGE_TYPE.validity));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MESSAGE_TYPE.noMovie);
      }

      // Проверим, принадлежит ли запись текущему пользователю
      const isOwn = movie.owner._id.equals(req.user._id);
      if (!isOwn) {
        throw new ForbiddenError(MESSAGE_TYPE.forbidden);
      }

      // Если проверка пройдена, удалим запись
      return Movie.findByIdAndRemove(req.params.movieId)
        .then((deletedMovie) => res.send(deletedMovie))
        .catch(next);
    })
    .catch(next);
};
