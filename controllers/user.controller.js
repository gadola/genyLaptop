const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const moment = require('moment')

// Info user
const getUser = async (req, res, next) => {
    let message = req.flash('error')
    return res.render('user/user', {
        path: "/users",
        pageTitle: "Tài khoản",
        errorMessage: message,
        user: req.user,
        moment:moment,
    })
}


module.exports = {
    getUser,
}