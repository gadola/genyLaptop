var express = require('express');
var router = express.Router();
const orderController = require('../controllers/order.controller')


router.get('/', orderController.getOrder)

module.exports = router