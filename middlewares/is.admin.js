const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
    try {
        if(!req.session.isLoggedIn){
            return res.redirect('/account/login');
        }
        if (!req.session.isAdmin) {
            req.session.destroy(err => {
                return res.redirect('/');
            })
        }
        // lấy user từ token => gán req.user
        let token = req.session.token
        const decoded = await jwt.verify(token , process.env.JWT_SECRET_KEY)
        const accountId = decoded.sub.accountId
        const user = await UserModel.findOne({accountId:accountId})
        req.user = user
        req.user.email = decoded.sub.email
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}