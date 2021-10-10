const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const VerifyModel = require('../models/verify.model')
const ProductModel = require('../models/product.model')
const LaptopModel = require('../models/laptop.model')
const helper = require('../helper/index')
const { cloudinary } = require('../configs/cloudinary.config');




// fn: upload product avatar to cloudinary
const uploadProductAvt = async (avtFile, productCode) => {
    try {
        const result = await cloudinary.uploader.upload(avtFile.tempFilePath, {
            folder: `products/${productCode}`,
        })
        const { secure_url } = result;
        return secure_url;
    } catch (error) {
        throw error;
    }
};


// dashboard
const dashboard = async (req, res, next) => {
    let message = req.flash('error')
    return res.render('admin/dashboard', {
        message: message
    });
}

// Lấy danh sách sản phẩm theo loại và trang hiện tra quản lý
const getProductList = async (req, res, next) => {
    try {
        const { type, page = 1, perPage = 10 } = req.query
        const nSkip = (parseInt(page) - 1) * parseInt(perPage)
        if (type == null) {
            var numOfProduct = await ProductModel.countDocuments({})
            var result = await ProductModel.find({})
                .skip(nSkip)
                .limit(parseInt(perPage))
        } else {
            var numOfProduct = await ProductModel.countDocuments({ type })
            var result = await ProductModel.find({ type })
                .skip(nSkip)
                .limit(parseInt(perPage))
        }
        let message = req.flash("info")
        return res.render('admin/seeProducts', {
            message: message,
            count: numOfProduct,
            data: result,
            hanlderRate: helper.hanlderRate,// xử lý rate
            converTypeToString: helper.converTypeToString // đổi số thành loại hàng
        });
    } catch (error) {
        throw error;
    }
}



// Thêm sản phẩm
const getAddProduct = async (req, res, next) => {
    let message = req.flash('error')
    return res.render('admin/addProduct', {
        message: message
    });
}
const postProduct = async (req, res, next) => {
    try {
        // lấy ảnh avt của product
        const avt = req.files.avt
        const {
            type,
            code,
            name,
            price,
            brand,
            stock,
            discount,
            // laptop
            warranty,
            chipBrand,
            processorCount,
            series,
            detail,
            displaySize,
            display,
            operating,
            disk,
            ram,
            pin,
            weight
        } = req.body

        // Kiểm tra product
        const isExist = await ProductModel.exists({ code })
        if (isExist) {
            return res.json("ma san pham ton tai")
        }

        // upload product avatar to cloudinary
        const avtUrl = await uploadProductAvt(avt, code);

        // tạo sản phẩm mới
        const newProduct = await ProductModel.create({
            code: code,
            name: name,
            price: price,
            type: type,
            brand: brand,
            avt: avtUrl,
            stock: stock,
            discount: discount,
        })

        if (newProduct) {
            // Tạo sản phẩm laptop
            const { _id } = newProduct
            const newLaptop = await LaptopModel.create({
                idProduct: _id,
                cpu: {
                    chipBrand: chipBrand,
                    processorCount: processorCount,
                    series: series,
                    detail: detail,
                },
                displaySize: displaySize,
                display: display,
                operating: operating,
                disk: disk,
                ram: ram,
                pin: pin,
                weight: weight,
                warranty: warranty,
            })
            if (newLaptop) {
                return res.redirect('/admin');
            } else {
                return res.json("tao laptop that bai")
            }
        } else {
            return res.json("tao san pham that bai")
        }


    } catch (error) {
        console.log(error);
        return res.json("loi tao product")
    }
}

// sửa sản phẩm 
const updateProduct = async (req, res, next) => {
    try {
        const { id, code, name, price, type, brand, stock, discount } = req.body
        const result = await ProductModel.updateOne(
            { _id: id },
            { code, name, price, type, brand, stock, discount },
        )
        if (result.modifiedCount == 1) {
            req.flash('info', "cập thành thành công")
            return res.redirect('/admin/products');
        } else {
            req.flash('info', "cập thành thất bại")
            return res.redirect('/admin/products');
        }

    } catch (error) {
        console.error(error);
        req.flash('info', "cập thành thất bại")
        return res.redirect('/admin/products');
    }
}

// xoá sản phẩm
const deleteProduct = async (req, res, next) => {
    try {
        const {id}= req.body
        const response = await ProductModel.findById(id).select('type')
        if(response){
            // xoá sản phẩm
            await ProductModel.deleteOne({_id:id})
            // xoá chi tiết sản phẩm
            const Model = helper.convertProductType(type)
            await Model.deleteOne({idProduct:id})
        }
        req.flash('info',"Xoá sản phẩm thành công")
        return res.redirect('/admin/products')

    } catch (error) {
        req.flash('info',"Xoá sản phẩm thất bại")
        return res.redirect('/admin/products')
    }

}



const testFields = async (req, res, next) => {
    return res.json(req.body.product)
}




module.exports = {
    dashboard,
    getProductList,
    getAddProduct,
    postProduct,
    updateProduct,
    deleteProduct,
    testFields,

}