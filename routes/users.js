var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller')
const isAuth = require('../middlewares/is.auth')

// User Info page
router.get('/', isAuth, userController.getUser)



module.exports = router;
