const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const VerifyModel = require('../models/verify.model')
const bcrypt = require('bcryptjs');
// const jwtConfig = require('../configs/jwt.config');
const jwt = require('jsonwebtoken');
const mailConfig = require('../configs/email.config')
const helper = require('../helper/index')
const constants = require('../constants/index')

// fn: Gửi mã xác thực để đăng ký
const postSendVerifyCode = async (req, res) => {
    try {
        const { email } = req.body
        // Kiểm tra tài khoản có tồn tại không
        const account = await AccountModel.findOne({ email })

        // nếu tồn tại, thông báo lỗi, return
        if (account) {
            let error = "Email đã được sử dụng"
            return res.status(400).json({ message: error });
        }
        console.log("cấu hình mail sẽ gửi");

        // cấu hình mail sẽ gửi
        const verifyCode = helper.generateVerifyCode(constants.NUMBER_VERIFY_CODE)
        const mail = {
            to: email,
            subject: "Mã xác thực tạo tài khoản",
            html: mailConfig.htmlSignupAccount(verifyCode)
        }
        console.log("đã cấu hinhf");
        // Lưu mã vào database để xác thực sau này
        await VerifyModel.findOneAndDelete({ email })
        await VerifyModel.create({
            code: verifyCode,
            email,
            dateCreated: Date.now(),
        })

        console.log("đã lưu");


        // Gửi mail
        const result = await mailConfig.sendEmail(mail)
        console.log("đã gửi");

        // nếu gửi thành công
        if (result) {
            return res.status(200).json({ message: "Gửi mã xác thực thành công!" });
        }


    } catch (error) {
        return res.status(400).json({
            message: " Gửi mã thất bại",
            error: error
        });
    }
}

// fn: đăng ký tài khoản
const getSignUp = async (req, res, next)=>{
    let message = req.flash('error')
    console.log(message);
    return res.render('account/signup', {
        path: "/account/signup",
        pageTitle: "Sign up",
        errorMessage: message,
        user: null
    });
}
const postSignUp = async (req, res, next) => {
    try {
        const {
            email,
            verifyCode,
            password,
            repassword,
            fullName,
            birthday,
            gender,
            address,

        } = req.body

        // kiểm tra tài khoản đã tồn tại hay chưa
        const account = await AccountModel.findOne({ email })
        if (account) {
            let error = "Email đã được đăng ký!"
            if (account) return res.status(400).json({ message: error });
        }

        // kiểm tra mã xác thực
        const isVerify = await helper.isVerifyEmail(email, verifyCode);
        if (!isVerify) {
            return res.status(400).json({ message: 'Mã xác nhận không hợp lệ !' });
        }

        // tạo tài khoản và user tương ứng
        if (repassword == password) {
            const newAcc = await AccountModel.create({
                email,
                password,
            })
            if (newAcc) {
                await UserModel.create({
                    accountId: newAcc._id,
                    fullName,
                    birthday,
                    gender,
                    address,
                })
            }
            // xoá mã xác nhận
            await VerifyModel.deleteOne({ email });

            return res.status(200).json({ message: "sign up successfully!" })
        } else {
            return res.status(400).json({ message: "password and repassword don't match" })
        }

    } catch (error) {
        return res.status(400).json({
            message: 'Account Creation Failed.',
            error,
        });
    }
}

//fn: Gửi mã xác thực để lấy lại mật khẩu
const postSendCodeForgotPW = async (req, res, next) => {
    try {
        const { email } = req.body
        console.log(email);

        // Kiểm tra tài khoản có tồn tại không
        const account = AccountModel.findOne({ email })
        if (!account) {
            return res.status(400).json({ message: "Tài khoản không tồn tại" });
        }

        // Cấu hình mail
        const verifyCode = helper.generateVerifyCode(constants.NUMBER_VERIFY_CODE)
        const mail = {
            to: email,
            subject: "Thay đổi mật khẩu",
            html: mailConfig.htmlResetPassword(verifyCode)
        }

        // Lưu mã vào database để xác thực sau này
        await VerifyModel.findOneAndDelete({ email })
        await VerifyModel.create({
            code: verifyCode,
            email,
            dateCreated: Date.now()
        })

        // Tiến hành gửi mail
        const resutl = await mailConfig.sendEmail(mail)

        // if thành công
        if (resutl) {
            return res.status(200).json({ message: "Mã xác nhận đã được gửi tới email của bạn" })
        }

    } catch (error) {
        return res.status(409).json({
            message: "Gửi mã thất bại",
            error
        })

    }
}

// fn: Đặt lại mật khẩu
const postResetPassword = async (req, res, next) => {
    try {
        const { email, password, verifyCode } = req.body
        // Kiểm tra mã xác thực
        const isVerify = await helper.isVerifyEmail(email, verifyCode)

        if (!isVerify) {
            return res.status(401).json({ message: "Mã xác nhận không hợp lệ" });
        }

        // check account => hash password => change password
        const hashPassword = await bcrypt.hash(
            password,
            parseInt(process.env.SALT_ROUND)
        )

        const response = await AccountModel.updateOne({ email }, { password: hashPassword })
        console.log('response',response);
        // check response
        if (response.modifiedCount == 1) {
            //xoá mã xác nhận
            await VerifyModel.deleteOne({ email });
            return res.status(200).json({ message: 'Thay đổi mật khẩu thành công' });

        } else {
            return res.status(409).json({ message: 'Thay đổi mật khẩu thất bại' });
        }


    } catch (error) {
        return res.status(409).json({ message: 'Thay đổi mật khẩu thất bại 1',error:error });

    }
}
const getResetPassword = async (req, res, next)=>{
    let message = req.flash('error')
    return res.render('account/forgot', {
        path: "/account/forgot-pw",
        pageTitle: "Reset password",
        errorMessage: message,
        user: null
    });
}


//fn : Đăng nhập
const getLogin = async (req, res, next) => {
    let message = req.flash('error')
    console.log(message);
    return res.render('account/login', {
        path: "/account/login",
        pageTitle: "Login",
        errorMessage: message,
        user: null
    });
}

// Note : login success -> create token -> save session -> redirect /
const postLogin = async (req, res, next) => {
    try {
        const { email, password, keepLogin } = req.body
        // Kiểm tra tài khoản có tồn tại không
        const account = await AccountModel.findOne({ email })
        if (!account) {
            return res.render('account/login', {
                path: '/account/login',
                errorMessage: 'Sai email hoặc mật khẩu',
                user: null
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, account.password)

        if (isMatch) {
            // đăng nhập thành công
            // từ account => lấy user
            const user = await UserModel.findOne({ accountId: account._id })
            req.session.isLoggedIn = true
            req.user = user

            // tạo token
            const token = jwt.sign(
                {
                    email: account.email,
                    accountId: user.accountId
                },
                process.env.JWT_SECRET_KEY
            )
            req.session.token = token
            return req.session.save(err => {
                res.redirect('/');
            })
        }
        return res.render('account/login', {
            path: '/account/login',
            errorMessage: 'Sai email hoặc mật khẩu',
            user: null
        });

    } catch (error) {
        console.log(error);
        return res.render('account/login', {
            path: '/account/login',
            errorMessage: 'Sai email hoặc mật khẩu',
            user: null
        });
    }
}

//fn: đăng xuất => huỷ session
const getLogout = async (req, res, next)=>{
    req.session.destroy(err =>{
        console.log(err);
         res.redirect('/');
    })
}




module.exports = {
    postSendVerifyCode,
    getSignUp,
    postSignUp,
    postSendCodeForgotPW,
    getResetPassword,
    postResetPassword,
    getLogin,
    postLogin,
    getLogout,
}