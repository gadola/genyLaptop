// ! dotenv config
require('dotenv').config()


// ! Third-party modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport')
// var busboyBodyParser = require('busboy-body-parser');
const fileupload = require('express-fileupload'); 


// ! Import local files
var indexRouter = require('./routes/index.route');
var usersRouter = require('./routes/users');
var accountRouter = require('./routes/account.route');
var adminRouter = require('./routes/admin.route');
var productRouter = require('./routes/product.route')
const isAuth = require('./middlewares/is.auth')
const isLogin = require('./middlewares/is.login')

var app = express();

// ======== MongoDB connect ========
var mongoose = require('mongoose')
    // Note: old version
    // const MONGO_URL = dev ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL
    // mongoose.connect(MONGO_URL, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true
    //     }).then(() => console.log("Database connection successful!"))
    //     .catch(err => console.log(`Database connection failed, ${err}`))

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI
})
mongoose.connect(
        process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => console.log("Database connection successful!"))
    .catch(err => console.log(`Database connection failed, ${err}`))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// App config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//- Dùng session để duy trì đăng nhập và để sử dụng flash
app.use(
    session({
        secret: 'tingodlike',
        resave: false, // session sẽ ko lưu với mỗi lệnh request => tốc đô
        saveUninitialized: false, // chắn chăn ko có session đc save mỗi request
        store: store
    }))
//parse multipart/form-data    
// app.use(busboyBodyParser());
app.use(fileupload({useTempFiles: true}))


// Dùng để đưa thông tin message 
app.use(flash())

// Cấu hình passport để giữ phiên đăng nhập
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    // gui ve 1 bien trong moi 1 route
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.Manager = req.session.isManager;
    res.locals.currentUser = req.session.user;
    res.locals.session = req.session;
    next();
});


const dev = app.get('env') !== 'production';

if (dev) {
    app.use(logger('dev'));
} else {
    app.use(logger('common'));
}





// ======== Router =========

// người dùng
app.use('/user',isAuth, usersRouter);

// tài khoản
app.use('/account', accountRouter);

// admin
app.use('/admin',isAuth, adminRouter);

app.use('/products',isLogin , productRouter)

// trang chủ
app.use('/',isLogin ,indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;