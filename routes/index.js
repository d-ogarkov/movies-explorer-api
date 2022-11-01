const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/not-found');
const { MESSAGE_TYPE } = require('../constants/errors');
const { createUserValidator, loginValidator } = require('../utils/validator');

// Эти роуты не требуют авторизации
router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginValidator, login);

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
