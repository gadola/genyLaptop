var express = require('express');
var router = express.Router();
const accountController = require('../controllers/account.controller')


// GET / login
router.get('/login', accountController.getLogin);
router.post('/login', accountController.postLogin);

// Sign Up
router.get('/signup', accountController.getSignUp);
router.post('/signup', accountController.postSignUp);

// Send verify code
router.post('/verify', accountController.postSendVerifyCode)
router.post('/verify/forgot', accountController.postSendCodeForgotPW)

// Logout
router.get('/logout',accountController.getLogout)

// Reset password
router.get('/forgot-pw', accountController.getResetPassword)
router.post('/forgot-pw', accountController.postResetPassword)



module.exports = router;