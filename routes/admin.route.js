var express = require('express');
var router = express.Router();
var multer = require('multer');

const adminController = require('../controllers/admin.controller')
const statitisController = require("../controllers/statitis.controller")


// dashboard
router.get('/2', adminController.dashboard);
router.get('/', adminController.dashboard2);


// Lấy danh sách sản phẩm theo loại và trang
router.get('/products2', adminController.getProductList);
router.get('/products', adminController.getProductList2);

// thêm Product
router.get('/products/add2', adminController.getAddProduct);
router.get('/products/add', adminController.getAddProduct2);
router.post('/products/add', adminController.postProduct);

// sửa sản phẩm
router.post('/products/update', adminController.updateProduct);

// xoá sản phẩm
router.post('/products/delete', adminController.deleteProduct);

//api: Lấy sản phẩm id
router.get('/products/:id', adminController.getProductById);

// Lấy danh sách người dùng và phân trang
router.get('/users2', adminController.getUsers)
router.get('/users', adminController.getUsers2)
router.post('/users/delete', adminController.delPostUser)
router.post('/users/update', adminController.postUpdateUser)

// lấy user by id
router.get('/user/:id', adminController.getUserById)
// lấy danh sách admin
router.get('/admins', adminController.getAdmins)
// router.post('/admins', adminController.postAdmins)

// cập nhật thông tin user
router.post('/user/update', adminController.putUser)


// Lấy danh sách đơn hàng và phân trang
router.get('/orders2', adminController.getOrders)
router.get('/orders', adminController.getOrders2)
// Lấy danh đơn hàng theo id
router.get('/order/:id', adminController.getOrderById)


// cập nhật đơn hàng
router.post('/orders', adminController.postOrders)

// api: thống kê doanh thu theo tháng
router.get('/monthly',statitisController.getStaMonthlyRevenue );

// api: thống kê doanh thu theo năm
router.get('/annual',statitisController.getStaAnnualRevenue );



module.exports = router;