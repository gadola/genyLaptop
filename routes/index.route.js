var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index.controller')
const productController = require('../controllers/product.controller')
const isAuth = require('../middlewares/is.auth')


// GET / trang chủ
router.get('/', indexController.index);


module.exports = router;