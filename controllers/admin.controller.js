const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const VerifyModel = require('../models/verify.model')
const ProductModel = require('../models/product.model')
const LaptopModel = require('../models/laptop.model')
const helper = require('../helper/index')
const { cloudinary } = require('../configs/cloudinary.config');
const OrderModel = require("../models/order.model")
const moment = require('moment')
const bcrypt = require('bcryptjs');
const jwtConfig = require('../configs/jwt.config');
const jwt = require('jsonwebtoken');
const mailConfig = require('../configs/email.config')
const constants = require('../constants/index')



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

// đăng nhập
const getLogin = async (req, res, next) => {
    let message = req.flash("info")
    return res.render('admin/login', {
        errorMessage: message,
        user: null
    });
}
const postLogin = async (req, res, next) => {
    try {
        const { email, password, keepLogin } = req.body
        const admin = await AdminModel.findOne({ email })
        if (!admin) {
            req.flash("info", "Email không tồn tại!")
            return res.redirect('/account/admin/login');
        }
        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, admin.password)

        if (isMatch) {
            // đăng nhập thành công
            req.session.isLoggedIn = true
            req.session.isAdmin = true
            req.user = user
            // tạo token
            const token = await jwtConfig.encodedToken(
                process.env.JWT_SECRET_KEY,
                {
                    email: admin.email,
                    adminId: admin._id
                }
            )
            req.session.token = token
            return req.session.save(err => {
                res.redirect('/admin');
            })
        }
        req.flash('info', "Email hoặc mật khẩu không đúng!")
        return res.redirect('/account/admin/login');
    } catch (error) {
        return res.status(400).json("có lỗi xảy ra!");
    }
}

//fn: đăng xuất => huỷ session
const getLogout = async (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/admin/login');
    })
}


// dashboard
const dashboard = async (req, res, next) => {
    try {
        const year = 2021
        // lấy danh sách đơn hàng trong năm thống kê (Chỉ lấy đơn hàng đã thanh toán)
        const thisYearOrder = await OrderModel.find({
            orderDate: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
            },
            orderStatus: 6,
        }).select('-_id');

        // kết quả sau thống kê
        let thisYear = [...Array(12).fill(0)]

        // thống kê
        if (thisYearOrder) {
            thisYearOrder.forEach((item) => {
                const month = new Date(item.orderDate).getMonth();
                const totalMoney =
                    item.orderProd.price * item.numOfProd + item.transportFee;
                thisYear[month] += totalMoney;
            });
        }
        console.log(thisYearOrder);
        return res.render('admin/dashboard', {
            user: req.user,
            thisYear: thisYear,
        });

    } catch (error) {
        console.log(error);
        return res.json("looix roi");
    }
}
const dashboard2 = async (req, res, next) => {
    try {
        const year = 2021
        // lấy danh sách đơn hàng trong năm thống kê (Chỉ lấy đơn hàng đã thanh toán)
        const thisYearOrder = await OrderModel.find({
            orderDate: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
            },
            orderStatus: 6,
        }).select('-_id');

        // kết quả sau thống kê
        let thisYear = [...Array(12).fill(0)]

        // thống kê
        if (thisYearOrder) {
            thisYearOrder.forEach((item) => {
                const month = new Date(item.orderDate).getMonth();
                const totalMoney =
                    item.orderProd.price * item.numOfProd + item.transportFee;
                thisYear[month] += totalMoney;
            });
        }
        console.log(thisYearOrder);
        return res.render('admin/testDashboard', {
            user: req.user,
            thisYear: thisYear,
        });

    } catch (error) {
        console.log(error);
        return res.json("looix roi");
    }
}

// api: lấy sản phẩm theo id
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params
        const product = await ProductModel.findById(id)
        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        return res.json("lỗi get product by id ", error)
    }


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
const getProductList2 = async (req, res, next) => {
    try {
        const { type, page = 1, perPage = 10 } = req.query
        const nSkip = (parseInt(page) - 1) * parseInt(perPage)
        if (type == null) {
            var numOfProduct = await ProductModel.countDocuments({})
            var result = await ProductModel.find({})
            // .skip(nSkip)
            // .limit(parseInt(perPage))
        } else {
            var numOfProduct = await ProductModel.countDocuments({ type })
            var result = await ProductModel.find({ type })
            // .skip(nSkip)
            // .limit(parseInt(perPage))
        }
        let message = req.flash("info")
        return res.render('admin/testProducts', {
            message: message,
            count: numOfProduct,
            data: result,
            hanlderRate: helper.hanlderRate,// xử lý rate
            converTypeToString: helper.converTypeToString, // đổi số thành loại hàng
            user: req.user,

        });
    } catch (error) {
        throw error;
    }
}


// Thêm sản phẩm
const getAddProduct = async (req, res, next) => {
    let message = req.flash('error')
    return res.render('admin/addProduct', {
        message: message,
        user: req.user,
    });
}
const getAddProduct2 = async (req, res, next) => {
    let message = req.flash('error')
    return res.render('admin/testAddProduct', {
        message: message,
        user: req.user,
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
        const { id } = req.body
        const response = await ProductModel.findById(id).select('type')
        if (response) {
            // xoá sản phẩm
            await ProductModel.deleteOne({ _id: id })
            // xoá chi tiết sản phẩm
            const Model = helper.convertProductType(type)
            await Model.deleteOne({ idProduct: id })
        }
        req.flash('info', "Xoá sản phẩm thành công")
        return res.redirect('/admin/products')

    } catch (error) {
        req.flash('info', "Xoá sản phẩm thất bại")
        return res.redirect('/admin/products')
    }

}

// quản lý người dùng
const getUsers = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10 } = req.query
        const nSkip = (parseInt(page) - 1) * parseInt(perPage)
        const users = await UserModel.find({})
        // .skip(nSkip)
        // .limit(perPage)
        for (let i = 0; i < users.length; i++) {
            const id = users[i].accountId
            let account = await AccountModel.findById(id)
            users[i].email = account.email
        }
        return res.render('admin/seeUsers', {
            user: req.user,
            users: users
        });

    } catch (error) {

    }
}
const getUsers2 = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10 } = req.query
        const nSkip = (parseInt(page) - 1) * parseInt(perPage)
        var accounts = await AccountModel.find({ role: false })
        // .skip(nSkip)
        // .limit(perPage)
        for (let i = 0; i < accounts.length; i++) {
            const id = accounts[i]._id
            let user = await UserModel.findOne({ accountId: id })
            accounts[i].user = user
        }
        let message = req.flash('info')
        return res.render('admin/testUsers', {
            user: req.user,
            accounts: accounts,
            message: message
        });

    } catch (error) {

    }
}
// POST xoá người dùng
const delPostUser = async (req, res, next) => {
    try {
        const { id } = req.body
        const account = await AccountModel.findById(id)
        if (account) {
            // xoá người dùng
            await UserModel.deleteOne({ accountId: id })
            // xoá tài khoản
            await AccountModel.deleteOne({ _id: id })
        }
        return res.status(200).json({ message: "xoá thành công!" });
    } catch (error) {
        return res.status(400).json({ message: "xoá không thành công!" });
    }
}
// PUT cập nhật user
const putUser = async (req, res, next) => {
    try {
        const { id, fullName, birthday, phone, address, gender } = req.body
        const result = await UserModel.updateOne(
            { _id: id },
            { fullName, phone, birthday, gender, address }
        )
        if (result.modifiedCount == 1) {
            req.flash('info', "cập thành thành công")
            return res.redirect('/admin/users');
        }
        req.flash('info', "cập thành không thành công")
        return res.redirect('/admin/users');
    } catch (error) {
        req.flash('info', "Có lỗi xảy ra")
        return res.redirect('/admin/users');
    }
}

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params
        const account = await AccountModel.findById(id)
        const user = await UserModel.findOne({ accountId: account._id })
        return res.status(200).json({ message: "success", account: account, user: user });
    } catch (error) {
        return res.status(400).json({ message: "false" });

    }
}

const postUpdateAdmin = async (req, res, next) => {
    try {
        const { email, password, fullName, phone, birthday, address, gender } = req.body
        const account = await AccountModel.findOne({ email })
        if (password) {
            const saltRounds = parseInt(process.env.SALT_ROUND)
            const hashPassword = await bcrypt.hash(password, saltRounds)

            await AccountModel.updateOne(
                { _id: account._id },
                { password: hashPassword }
            )
        }
        const updateUser = await UserModel.updateOne(
            { accountId: account._id },
            { fullName, phone, birthday, gender, address }
        )
        if ( updateUser.modifiedCount == 1) {
            req.flash('error', "cập nhật thành công")
            return res.redirect('/admin/admins');
        } else {
            console.log(updateUser);
            req.flash('error', "cập nhật sắp thành công")
            return res.redirect('/admin/admins');
        }

    } catch (error) {
        req.flash('error', "cập nhật không thành công")
        return res.redirect('/admin/admins');
    }
}


// quản lý đơn hàng
const getOrders = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10 } = req.query
        const nSkip = (parseInt(page) - 1) * parseInt(perPage)
        const orders = await OrderModel.find({})
            .skip(nSkip)
            .limit(perPage)
        return res.render('admin/seeOrders', {
            user: req.user,
            orders: orders,
            toStatusString: helper.convertNumberToOrderStatus,
            toPaymentMethodString: helper.convertNumberToPaymentMethod,
            moment: moment

        });
    } catch (error) {

    }
}
const getOrders2 = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10 } = req.query
        const nSkip = (parseInt(page) - 1) * parseInt(perPage)
        const orders = await OrderModel.find({}).sort("-orderDate")
        // .skip(nSkip)
        // .limit(perPage)
        let message = req.flash('info')

        return res.render('admin/testOrder', {
            user: req.user,
            orders: orders,
            toStatusString: helper.convertNumberToOrderStatus,
            toPaymentMethodString: helper.convertNumberToPaymentMethod,
            moment: moment,
            message: message

        });
    } catch (error) {

    }
}
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params
        const order = await OrderModel.findById(id)
        return res.status(200).json({ message: "success", order: order });
    } catch (error) {
        return res.status(400).json({ message: "error", order: error });
    }
}

const postOrders = async (req, res, next) => {
    try {
        const { id, orderStatus } = req.body
        const order = await OrderModel.findById(id)
        if (!order) {
            return res.status(400).json("k tìm thấy đơn hàng");
        }
        const result = await OrderModel.updateOne(
            { _id: id },
            { orderStatus: orderStatus }
        )
        if (result.modifiedCount == 1) {
            req.flash('info', "cập nhật thành công")
            return res.redirect('/admin/orders');
        } else {
            req.flash('info', "cập nhật thất bại")
            return res.redirect('/admin/orders');
        }
    } catch (error) {
        console.log(error);
        return res.json("lỗi cập nhật");
    }
}

const prinfOrder = async (req, res, next)=>{
    const { id } = req.params
    console.log(id);
    var order = await OrderModel.findById(id)
    return res.render("admin/detailOrder",{
        user: req.user,
        order: order,
        toStatusString: helper.convertNumberToOrderStatus,
        toPaymentMethodString: helper.convertNumberToPaymentMethod,
        moment: moment,
    });
}


// quản lý admins
const getAdmins = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10 } = req.query
        const nSkip = (parseInt(page) - 1) * parseInt(perPage)
        var accounts = await AccountModel.find({ role: true })
        // .skip(nSkip)
        // .limit(perPage)
        for (let i = 0; i < accounts.length; i++) {
            const id = accounts[i]._id
            let user = await UserModel.findOne({ accountId: id })
            accounts[i].user = user
        }
        let message = req.flash("error")
        return res.render('admin/seeAdmins', {
            user: req.user,
            accounts: accounts,
            errorMessage: message,
        });

    } catch (error) {

    }
}
const postAdmins = async (req, res, next) => {

}



module.exports = {
    dashboard,
    getLogin,
    postLogin,
    getLogout,
    getProductById,
    getProductList,
    getAddProduct,
    postProduct,
    updateProduct,
    deleteProduct,
    getUserById,
    getUsers,
    delPostUser,
    postUpdateAdmin,
    getOrders,
    postOrders,
    getOrderById,
    getOrders2,
    prinfOrder,
    getProductList2,
    getUsers2,
    getAddProduct2,
    dashboard2,
    getAdmins,
    putUser,
}