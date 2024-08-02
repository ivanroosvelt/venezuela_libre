const express = require('express');
const userController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/profile', isAuth, userController.getUserProfile);
router.put(
  '/profile',
  isAuth,
  userController.updateUserProfile
);

module.exports = router;
