const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const VerifyModel = require('../models/verify.model')
const ProductModel = require('../models/product.model')
const LaptopModel = require('../models/laptop.model')
const helper = require('../helper/index')

const mailConfig = require('../configs/email.config')


// lấy 12 sản phẩm mới nhất
const get12NewProduct = async (numOfProduct=12)=>{
    const products = await ProductModel.find({})
        .limit(numOfProduct)
    return products
}

// Trang chủ
const index = async (req, res, next) => {
    const products = await get12NewProduct(12)
    return res.render('index', {
        path: "/",
        pageTitle: "GENY Store",
        products: products,
        user: req.user
    });
}





module.exports = {
    index,

}