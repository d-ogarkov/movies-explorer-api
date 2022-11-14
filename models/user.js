const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const AuthError = require('../errors/auth');
const { MESSAGE_TYPE } = require('../constants/errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail],
  },
  password: {
    type: String,
    required: true,
    select: false, // Не возвращать хэш пароля в селекте
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  // Поскольку в модели для password указано 'select: false', по умолчанию оно
  // не возвращается, и здесь нужно в явном виде запросить селект этого поля
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError(MESSAGE_TYPE.wrongLogin));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError(MESSAGE_TYPE.wrongLogin));
          }

          return user; // Теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
