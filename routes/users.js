const router = require('express').Router();
const {
  getCurrentUser, updateUser,
} = require('../controllers/users');
const { updateUserValidator } = require('../utils/validator');

router.get('/me', getCurrentUser);
router.patch('/me', updateUserValidator, updateUser);

module.exports = router;
