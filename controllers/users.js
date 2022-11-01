const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/not-found');
const ValidityError = require('../errors/validity');

const { NODE_ENV, JWT_SECRET } = process.env;
const { ERROR_TYPE, MESSAGE_TYPE } = require('../constants/errors');

module.exports.createUser = (req, res, next) => {
  const {
    email, name, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, name, password: hash,
    }))
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(MESSAGE_TYPE.userExists));
      }
      if (err.name === ERROR_TYPE.validity) {
        return next(new ValidityError(MESSAGE_TYPE.validity));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token }).end();
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).select('email name _id')
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE_TYPE.noUser);
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true, // Вернуть обновленную запись из базы, а не старую
      runValidators: true, // Данные будут валидированы перед изменением
    },
  ).select('email name _id')
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE_TYPE.noUser);
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(MESSAGE_TYPE.userExists));
      }
      if (err.name === ERROR_TYPE.validity) {
        return next(new ValidityError(MESSAGE_TYPE.validity));
      }
      return next(err);
    });
};
