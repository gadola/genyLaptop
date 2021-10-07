var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index.controller')
const isAuth = require('../middlewares/is.auth')


// GET / trang chủ
router.get('/', isAuth, indexController.index);


module.exports = router;