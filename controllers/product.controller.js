const ProductModel = require("../models/product.model")
const LaptopModel = require("../models/laptop.model")
const { Model } = require('mongoose');
const helper = require("../helper/index")


// lấy 12 sản phẩm mới nhất
const get12NewProduct = async (numOfProduct = 12) => {
    const products = await ProductModel.find({})
        .limit(numOfProduct)
    return products
}
// trang chủ
const index = async (req, res, next) => {
    const newestProducts = await get12NewProduct(12)
    return res.render('index', {
        path: "/",
        newestProducts: newestProducts,
        user: req.user
    });
}

// lấy tất cả sản phẩm và phân trang


// tìm kiếm sản phẩm


// lọc sản phẩm

// api: Lấy 1 sản phẩm theo id
const getProduct = async (req, res, next) => {
    const { id } = req.query

    // lấy tổng quan sản phẩm
    const product = await ProductModel.findById(id)

    // lấy chi tiết sản phẩm theo loại
    const { _id, type } = product
    const Model = helper.convertProductType(type)
    const productDetail = await Model.findOne({
        idProduct: product._id,
    })
    return res.status(200).json({ product, productDetail });
}

const getProductByCode = async (req, res, next) => {
    try {
        const code = req.params.code
        console.log(typeof(code.code));
        // lấy sản phẩm
        const product = await ProductModel.findOne({ code })

        if (product) {
            const productDetail = await LaptopModel.findOne({idProduct:product._id})
            let context = {
                product: product,
                productDetail:productDetail,
                convertSerisToString:helper.convertSerisToString,
                hanlderRate:helper.hanlderRate,
                user: req.user
            }
            return res.render('product/detailProduct', context);
        }
        return res.json(code);
    } catch (error) {
        return res.json(error);
    }
}




module.exports = {
    index,
    getProduct,
    getProductByCode,
}