const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
    try {
        if (!req.session.isLoggedIn) {
            return res.redirect('/account/login');
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