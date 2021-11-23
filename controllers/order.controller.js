const OrderModel = require("../models/order.model")
const DetailOrderModel = require("../models/detailOder.model")
const moment = require('moment')
const jwt = require("jsonwebtoken")
const helper = require('../helper')
const ProductModel = require('../models/product.model')

// lấy lịch sử chi tiết đơn hàng
const getOrder = async (req, res, next) => {
    try {
        const { id } = req.query
        const order = await OrderModel.findById(id)
        // lấy orders đã đặt
        return res.render('user/order', {
            user: req.user,
            pageTitle: "GENY Laptop",
            order: order,
            convertNumberToOrderStatus: helper.convertNumberToOrderStatus,
            convertNumberToPaymentMethod: helper.convertNumberToPaymentMethod,
            convertNumberToTransportMethod: helper.convertNumberToTransportMethod,
        });
    } catch (error) {

    }
}

module.exports = {
    getOrder,
}