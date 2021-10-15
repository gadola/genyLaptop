var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller')

// User Info page
router.get('/', userController.getUser)

// Cập nhật thông tin user
router.post('/update', userController.putUpdateUserInfo)

// Lịch sử giao dịch
router.get('/order', userController.getOrder)


module.exports = router;
