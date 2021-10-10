const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken');

// Đã login => lấy info user : next() 
module.exports = async (req, res, next) => {
    try {
        if (!req.session.isLoggedIn) {
            next()
            return
        }
        // lấy user từ token => gán req.user
        let token = req.session.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const accountId = decoded.accountId
        const user = await UserModel.findOne({accountId:accountId})
        req.user = user
        req.user.email = decoded.email
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}