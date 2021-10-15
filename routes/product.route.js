var express = require('express');
var router = express.Router();
const isAuth = require("../middlewares/is.auth")
const productController = require('../controllers/product.controller')

// api: Lấy 1 sản phẩm theo id
// router.get('/:id', productController.getProduct);


// lấy tất cả sản phẩm và phân trang
// router.get('/',productController.getProducts)

router.get('/cart',productController.getCart)
router.get('/checkout',isAuth, productController.getCheckout)
router.post('/checkout',productController.postCheckout)

// Lấy 1 sản phẩm theo code
router.get('/:code', productController.getProductByCode);

// tìm sản phẩm
router.get('/', productController.getSearchProducts);


module.exports  = router