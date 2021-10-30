const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const OrderModel = require("../models/order.model")
const DetailOrderModel = require("../models/detailOder.model")
const moment = require('moment')
const jwt = require("jsonwebtoken")
const helper = require('../helper')
const ProductModel = require('../models/product.model')

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

// fn: Cập nhật thông tin người dùng
const putUpdateUserInfo = async (req, res, next) => {
    try {
        const { fullName, birthday, phone, address, gender } = req.body
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

const postRateProduct = async (req, res, next) => {
    try {
        let backURL=req.header('Referer') || '/'
        const { id, rating, idOrder } = req.body
        // check đã đánh giá chưa?
        const order = await OrderModel.findById(idOrder)

        if(order.rated != 0 || !order.rated){
            return res.status(300).json({message:"Bạn đã đánh giá đơn hàng này rồi"});
        }
        // lấy sản phẩm
        const prod = await ProductModel.findById(id)
        var rate = [...prod.rate]
        let index = parseInt(rating) - 1
        rate[index] += 1
        if (!prod) {
            return res.redirect('');
        }

        // cập nhật rate
        const result = await ProductModel.updateOne(
            { _id: id },
            { rate: rate }
        )
        console.log(rate);

        if (result.modifiedCount == 1) {
            await OrderModel.updateOne({_id:idOrder},{rated:rating})
            return res.redirect(backURL);
            return res.status(200).json({message:"đánh giá thành công"});
        } else {
            return res.redirect('/404');
            return res.status(400).json({message:"đánh giá không thành công"});
        }
    } catch (error) {
        return res.redirect('/404');

        return res.status(400).json({message:"có lỗi xảy ra"});
    }
}
module.exports = {
    getUser,
    putUpdateUserInfo,
    getOrder,
    postRateProduct,
}