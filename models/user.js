const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/auth');
const { REGEX_PATTERN } = require('../constants/patterns');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { // Валидация корректности email на уровне схемы
      validator(v) {
        return REGEX_PATTERN.email.test(v);
      },
    },
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
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильные почта или пароль'));
          }

          return user; // Теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
