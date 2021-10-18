const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const OrderModel = require("../models/order.model")
const DetailOrderModel = require("../models/detailOder.model")
const moment = require('moment')
const jwt = require("jsonwebtoken")
const helper = require('../helper')

// Info user lấy lịch sử đơn hàng
const getUser = async (req, res, next) => {
    const accountId = req.user.accountId
    const user = await UserModel.findOne({ accountId })

    // lấy orders đã đặt
    var orders = await OrderModel.find({ owner: user._id }).sort("-orderDate")
    let message = req.flash('error')
    return res.render('user/user', {
        path: "/user",
        pageTitle: "Tài khoản",
        errorMessage: message,
        user: req.user,
        orders: orders,
        moment: moment,
        toString: helper.convertNumberToOrderStatus,
    })
}
const putUpdateUserInfo = async (req, res, next) => {
    try {
        const { fullName, birthday,phone ,address, gender } = req.body
        const id = req.user.accountId
        if (await UserModel.exists({ accountId: id })) {
            const response = await UserModel.updateOne({ accountId: id }, {
                $set: {
                    fullName: fullName,
                    birthday: birthday,
                    address: address,
                    phone: phone,
                    gender: gender
                }
            })
            if (response) {
                req.flash("info", "cập nhật thành công")
                return res.redirect('/user');
            }
        } else {
            return res.render('user/user', {
                path: "/user",
                pageTitle: "Tài khoản",
                errorMessage: "User không tồn tại!",
                user: req.user,
                moment: moment,
            })
        }

    } catch (error) {
        console.log(error);
        return res.render('user/user', {
            path: "/user",
            pageTitle: "Tài khoản",
            errorMessage: "Cập nhật thất bại",
            user: req.user,
            moment: moment,
        })
    }
}


// lấy lịch sử chi tiết đơn hàng
const getOrder = async (req, res, next) => {
    try {
        const {id} = req.query
        const detailOrders = await DetailOrderModel.find({ idOrder:id })

        // lấy orders đã đặt
        return res.render('user/order', {
            user: req.user,
            pageTitle: "GENY Laptop",
            detailOrders: detailOrders,
        });
    } catch (error) {

    }
}

module.exports = {
    getUser,
    putUpdateUserInfo,
    getOrder,
}