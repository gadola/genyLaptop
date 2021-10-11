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
const getProducts = async (req, res, next) => {
    try {
        var { page, perPage } = req.query
        if (!page) page = 1
        if (!perPage) perPage = 12
        // lấy toàn bộ sản phẩm
        const nSkip = (parseInt(page) - 1) * parseInt(perPage)
        const products = await ProductModel.find({})
            .skip(nSkip)
            .limit(parseInt(perPage))
        return res.render('product/products', {
            products: products,
            user: req.user,
        });
    } catch (error) {
        console.log(error)
        return res.json("lỗi",error);
    }

}

// tìm kiếm sản phẩm
const getSearchProducts = async (req, res, next) => {
    try {
        var {value,price , page, perPage } = req.query

        // pagination
        if (!page) page = 1;
        if (!perPage) perPage = 12;
        const nSkip = (parseInt(page) - 1) * perPage;

        // query
        let numOfProduct = 0
        let result = []
        let query = {
            $text: {
                $search: `${value}`,
            }
        }

        // lọc theo điều kiện nếu có
        if (value !== "") {
            numOfProduct=await ProductModel.find(query).countDocuments();
            result = await ProductModel.find(query)
                .skip(nSkip)
                .limit(parseInt(perPage))
        } else {
            // trả về tất cả
            numOfProduct=await ProductModel.find({}).countDocuments();
            result = await ProductModel.find({})
                .skip(nSkip)
                .limit(parseInt(perPage))
        }
        if(result){
            return res.render('product/searchProducts',{
                products:result,
                numOfProduct:numOfProduct,
                key:value,
                user:req.user,
            });
        }

    } catch (error) {
        console.error('Search product error: ', error);
        return res.json("lỗi search:",error)
    }
}

// lọc sản phẩm


const getProductByCode = async (req, res, next) => {
    try {
        const code = req.params.code
        // lấy sản phẩm
        const product = await ProductModel.findOne({ code })

        if (product) {
            const productDetail = await LaptopModel.findOne({ idProduct: product._id })
            let context = {
                product: product,
                productDetail: productDetail,
                convertSerisToString: helper.convertSerisToString,
                hanlderRate: helper.hanlderRate,
                user: req.user
            }
            return res.render('product/detailProduct', context);
        }
        return res.json("code",code);
    } catch (error) {
        return res.json(error);
    }
}




module.exports = {
    index,
    getProductByCode,
    getProducts,
    getSearchProducts,
}