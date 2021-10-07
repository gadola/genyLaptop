const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const VerifyModel = require('../models/verify.model')

const mailConfig = require('../configs/email.config')


// Trang chủ
// GET /
const index = async (req, res, next) => {
    console.log(req.user);
    console.log(req.session.isLoggedIn);
    return res.render('index', { user: req.user });
}





module.exports = {
    index,

}