const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const moment = require('moment')
const jwt = require("jsonwebtoken")

// Info user
const getUser = async (req, res, next) => {
    let message = req.flash('error')
    return res.render('user/user', {
        path: "/user",
        pageTitle: "Tài khoản",
        errorMessage: message,
        user: req.user,
        moment: moment,
    })
}
const putUpdateUserInfo = async (req, res, next) => {
    try {
        const { fullName, birthday, address, gender } = req.body
        const id = req.user.accountId
        if (await UserModel.exists({ accountId: id })) {
            const response = await UserModel.updateOne({ accountId: id }, {
                $set: {
                    fullName: fullName,
                    birthday: birthday,
                    address: address,
                    gender: gender
                }
            })
            if (response) {
                req.flash("info","cập nhật thành công")
                return  res.redirect('/user');
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

module.exports = {
    getUser,
    putUpdateUserInfo,
}