const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/not-found');
const { MESSAGE_TYPE } = require('../constants/errors');
const { REGEX_PATTERN } = require('../constants/patterns');

// Эти роуты не требуют авторизации
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(REGEX_PATTERN.email),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(REGEX_PATTERN.email),
    password: Joi.string().required(),
  }),
}), login);

// Авторизация
router.use(auth);

// Все роуты ниже требуют авторизации
router.use('/users', userRouter);
router.use('/movies', movieRouter);

// После всех роутов ловим неправильные пути
router.use(() => {
  throw new NotFoundError(MESSAGE_TYPE.noPath);
});

module.exports = router;
