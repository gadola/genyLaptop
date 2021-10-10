var express = require('express');
var router = express.Router();
var multer = require('multer');

const adminController = require('../controllers/admin.controller')

// dashboard
router.get('/', adminController.dashboard);

// Lấy danh sách sản phẩm theo loại và trang
router.get('/products', adminController.getProductList);

// thêm Product
router.get('/products/add', adminController.getAddProduct);
router.post('/products/add', adminController.postProduct);

// sửa sản phẩm
router.post('/products/update', adminController.updateProduct);

// xoá sản phẩm
router.post('/products/delete', adminController.deleteProduct);

// test
router.post('/test', adminController.testFields);


module.exports = router;