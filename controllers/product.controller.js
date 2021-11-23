const ProductModel = require("../models/product.model")
const LaptopModel = require("../models/laptop.model")
const OrderModel = require("../models/order.model")
const DetailOrderModel = require("../models/detailOder.model")
const { Model } = require('mongoose');
const helper = require("../helper/index");
const constants = require('../constants/index')
const AccountModel = require("../models/account.model");
const UserModel = require("../models/user.model");

// lấy ngẫu nhiên 2 sản phẩm
const getRandom2Product = async (num = 2)=>{
    const count = await ProductModel.find({}).countDocuments()

    var random = Math.floor(Math.random()*count - num)
    while(random < 0){
        random = Math.floor(Math.random()*count - num)
    }
    const prod = await ProductModel.find({}).skip(random).limit(num)
    return prod
}

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
            pageTitle: "Sản Phẩm",
        });
    } catch (error) {
        console.log(error)
        return res.json("lỗi", error);
    }

}

// tìm kiếm sản phẩm theo tên theo thương hiệu
const getSearchProducts = async (req, res, next) => {
    try {
        // ex: value ="laptop", priceMin=10000000, priceMax = 20000000, 
        //page = 2, perPage=8, sortBy ="price"|"-price", discount="discount"|"-discount"
        var { value, min, max, page, perPage, sortby } = req.query
        if (!value) value = ""
        if (!sortby) sortby = 'name'
        if (!min) min = 0
        if (!max) max = 1000000000

        // pagination
        if (!page) page = 1;
        if (!perPage) perPage = 9;
        const nSkip = (parseInt(page) - 1) * perPage;

        // query
        let numOfProduct = 0
        let result = []
        let query = {}
        if (!value) {
            query = {
                "price": {
                    $gt: min,
                    $lt: max
                }
            }
        } else {
            query = {
                $text: {
                    $search: `${value}`,
                },
                "price": {
                    $gt: min,
                    $lt: max
                }
            }
        }

        // lọc theo điều kiện nếu có
        // if (!value) {
        numOfProduct = await ProductModel.find(query).countDocuments();
        result = await ProductModel.find(query)
            .skip(nSkip)
            .limit(parseInt(perPage))
            .sort(sortby)
        // } else {
        //     // trả về tất cả
        //     numOfProduct = await ProductModel.find({}).countDocuments();
        //     result = await ProductModel.find({})
        //         .skip(nSkip)
        //         .limit(parseInt(perPage))
        //         .sort(sortby)
        // }
        var random2prod = await getRandom2Product()
        if (result) {
            return res.render('product/searchProducts', {
                products: result,
                randomProduct: random2prod,
                numOfProduct: numOfProduct,
                key: value,
                user: req.user,
                pageTitle: "Sản Phẩm",
            });
        }

    } catch (error) {
        console.error('Search product error: ', error);
        return res.json("lỗi search:", error)
    }
}
// api: tìm kiếm sản phẩm theo tên theo thương hiệu phân trang
const apiGetSearchProducts = async (req, res, next) => {
    try {
        // ex: value ="laptop", priceMin=10000000, priceMax = 20000000, 
        //page = 2, perPage=8, sortBy ="price"|"-price", discount="discount"|"-discount"
        var { value, min, max, page, perPage, sortby } = req.query
        if (!value) value = ""
        if (!sortby) sortby = 'name'
        if (!min) min = 0
        if (!max) max = 1000000000

        // pagination
        if (!page) page = 1;
        if (!perPage) perPage = 9;
        const nSkip = (parseInt(page) - 1) * perPage;

        // query
        let numOfProduct = 0
        let result = []
        let query = {}
        if (!value) {
            query = {
                "price": {
                    $gt: min,
                    $lt: max
                }
            }
        } else {
            query = {
                $text: {
                    $search: `${value}`,
                },
                "price": {
                    $gt: min,
                    $lt: max
                }
            }
        }

        // lọc theo điều kiện nếu có
        // if (!value) {
        numOfProduct = await ProductModel.find(query).countDocuments();
        result = await ProductModel.find(query)
            .skip(nSkip)
            .limit(parseInt(perPage))
            .sort(sortby)
        // } else {
        //     // trả về tất cả
        //     numOfProduct = await ProductModel.find({}).countDocuments();
        //     result = await ProductModel.find({})
        //         .skip(nSkip)
        //         .limit(parseInt(perPage))
        //         .sort(sortby)
        // }
        if (result) {
            return res.status(200).json({ products: result, numOfProduct: numOfProduct })
        }

    } catch (error) {
        console.error('Search product error: ', error);
        return res.json("lỗi search:", error)
    }
}

// lấy sản phẩm bằng code
const getProductByCode = async (req, res, next) => {
    try {
        const code = req.params.code
        // lấy sản phẩm
        const product = await ProductModel.findOne({ code })
        // lấy sản phẩm cùng thương hiệu
        const brand = product.brand
        var query = {
            $text: {
                $search: `${brand}`,
            }
        }
        const relatedProducts = await ProductModel.find(query)
            .limit(6)

        if (product) {
            const productDetail = await LaptopModel.findOne({ idProduct: product._id })
            let context = {
                product: product,
                productDetail: productDetail,
                relatedProducts:relatedProducts,
                convertSerisToString: helper.convertSerisToString,
                hanlderRate: helper.hanlderRate,
                user: req.user,
                pageTitle: "Sản Phẩm " + product.code,

            }
            return res.render('product/detailProduct', context);
        }
        return res.status(400).json({ code: code });
    } catch (error) {
        return res.json(error);
    }
}

// lấy sản phẩm => display cart
const getCart = async (req, res, next) => {
    return res.render('product/cart', {
        pageTitle: "Giỏ hàng",
        user: req.user
    });
}

// trang thanh toán
const getCheckout = async (req, res, next) => {
    return res.render('product/checkout', {
        pageTitle: "Thanh toán",
        user: req.user,
    });
}
const postCheckout = async (req, res, next) => {
    try {
        const { data, paymentMethod, shipMethod, note } = req.body
        const accountId = req.user.accountId

        // kiểm tra user
        const user = await UserModel.findOne({ accountId })

        if (!user) {
            return res.status(400).json("User không tồn tại!");
        }

        // mỗi sản phẩm tạo 1 order => trừ số lượng tồn kho
        for (let i = 0; i < data.length; i++) {
            // lấy sản phẩm 
            const prod = await ProductModel.findById(data[i].id)
            // nếu tồn tại sản phẩm và số lượng tồn >= số lượng mua
            if (!prod || prod.stock < data[i].number) { 
                return res.status(400).json("Số lượng sản phẩm đã thay đổi, vui lòng thử lại!");
                break
            }
            // tạo đơn hàng
            const newOrder = await OrderModel.create({
                orderCode:helper.generateVerifyCode(constants.NUMBER_VERIFY_CODE),
                owner: user._id,
                deliveryAdd: {
                    name: user.fullName,
                    phone: user.phone,
                    address: user.address
                },
                orderDate: new Date(),
                orderProd: {
                    id: prod._id,
                    code: prod.code,
                    name: prod.name,
                    price: prod.price,
                    discount: prod.discount
                },
                numOfProd: data[i].number,
                orderStatus: 0,
                paymentMethod: paymentMethod,
                transportFee: 0,
                totalPrice: prod.price * data[i].number,
                transportMethod: shipMethod,
                note: note
            })
            // trừ số lượng tồn kho
            if (!newOrder) {
                return res.status(400).json("Lỗi tạo đơn hàng!");
            }
            await ProductModel.updateOne(
                { _id: data[i].id },
                { stock: prod.stock - data[i].number }
            )
        }
        return res.status(200).json("đặt thành công");

    } catch (error) {
        console.log(error);
        return res.status(400).json(error);

    }
}



module.exports = {
    index,
    getProductByCode,
    getProducts,
    getSearchProducts,
    apiGetSearchProducts,
    getCart,
    getCheckout,
    postCheckout
}