var express = require('express');
var router = express.Router();
var multer = require('multer');

const adminController = require('../controllers/admin.controller')

// dashboard
router.get('/', adminController.dashboard);

//api: Lấy sản phẩm id
router.get('/products/:id', adminController.getProductById);

// Lấy danh sách sản phẩm theo loại và trang
router.get('/products', adminController.getProductList);

// thêm Product
router.get('/products/add', adminController.getAddProduct);
router.post('/products/add', adminController.postProduct);

// sửa sản phẩm
router.post('/products/update', adminController.updateProduct);

// xoá sản phẩm
router.post('/products/delete', adminController.deleteProduct);

// Lấy danh sách người dùng và phân trang
router.get('/users', adminController.getUsers)

// Lấy danh sách đơn hàng và phân trang
router.get('/orders', adminController.getOrders)

// cập nhật đơn hàng
router.post('/orders', adminController.postOrders)
// test


module.exports = router;