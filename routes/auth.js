const express = require('express');
const { check, body } = require('express-validator/');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignUp);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a validd email'),
    body(
      'password',
      'Please enter a valid  email')
      .isAlphanumeric()
      .isLength({ min: 5 }),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error('')
        }
      })
  ], authController.postSignUp);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;