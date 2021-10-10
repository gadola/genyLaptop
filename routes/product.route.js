var express = require('express');
var router = express.Router();

const productController = require('../controllers/product.controller')

// api: Lấy 1 sản phẩm theo id
router.get('/', productController.getProduct);

// Lấy 1 sản phẩm theo code
router.get('/:code', productController.getProductByCode);


module.exports  = router