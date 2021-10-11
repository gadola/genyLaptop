var express = require('express');
var router = express.Router();

const productController = require('../controllers/product.controller')

// api: Lấy 1 sản phẩm theo id
// router.get('/:id', productController.getProduct);


// lấy tất cả sản phẩm và phân trang
router.get('/',productController.getProducts)

// tìm sản phẩm
router.get('/search', productController.getSearchProducts);

// Lấy 1 sản phẩm theo code
router.get('/:code', productController.getProductByCode);




module.exports  = router