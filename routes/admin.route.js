var express = require('express');
var router = express.Router();
var multer = require('multer');

const adminController = require('../controllers/admin.controller')
const statitisController = require("../controllers/statitis.controller")

// dashboard
router.get('/', adminController.dashboard);
router.get('/aa', adminController.dashboard2);



// Lấy danh sách sản phẩm theo loại và trang
router.get('/products', adminController.getProductList);
router.get('/products2', adminController.getProductList2);

// thêm Product
router.get('/products/add', adminController.getAddProduct);
router.get('/products/add2', adminController.getAddProduct2);
router.post('/products/add', adminController.postProduct);

// sửa sản phẩm
router.post('/products/update', adminController.updateProduct);

// xoá sản phẩm
router.post('/products/delete', adminController.deleteProduct);

//api: Lấy sản phẩm id
router.get('/products/:id', adminController.getProductById);

// Lấy danh sách người dùng và phân trang
router.get('/users', adminController.getUsers)
router.get('/users2', adminController.getUsers2)

// Lấy danh sách đơn hàng và phân trang
router.get('/orders', adminController.getOrders)
router.get('/orders2', adminController.getOrders2)
// Lấy danh sách đơn hàng và phân trang

// cập nhật đơn hàng
router.post('/orders', adminController.postOrders)

// api: thống kê doanh thu theo tháng
router.get('/monthly',statitisController.getStaMonthlyRevenue );

// api: thống kê doanh thu theo năm
router.get('/annual',statitisController.getStaAnnualRevenue );



module.exports = router;