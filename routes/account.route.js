var express = require('express');
var router = express.Router();
const accountController = require('../controllers/account.controller')
const adminController = require("../controllers/admin.controller")
// login bằng admin
router.get('/admin/login', adminController.getLogin);
router.post('/admin/login', adminController.postLogin);
router.get('/admin/logout', adminController.getLogout);

// thêm account admin
router.post('/admin/signup', accountController.postSignUpAdmin);



// GET / login
router.get('/login', accountController.getLogin);
router.post('/login', accountController.postLogin);

// Sign Up
// router.get('/signup', accountController.getSignUp);
router.get('/signup', accountController.getSignUp2);
router.post('/signup', accountController.postSignUp);

// Send verify code
router.post('/verify', accountController.postSendVerifyCode)
router.post('/verify/forgot', accountController.postSendCodeForgotPW)

// Logout
router.get('/logout',accountController.getLogout)

// Reset password
router.get('/forgot-pw', accountController.getResetPassword)
router.post('/forgot-pw', accountController.postResetPassword)

// Đổi mật khẩu
router.get('/change-pw', accountController.getChangePassword)
router.post('/change-pw', accountController.postChangePassword)

module.exports = router;