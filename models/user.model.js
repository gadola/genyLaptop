const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var userSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'account'
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    birthday: {
        type: String,
        default: '1970-01-01',
    },
    // true :male
    gender: {
        type: Boolean,
        required: true,
        default: true
    },
    address: {
        type: String,
        trim: true,
        default: null
    }

})

const UserModel = mongoose.model('user', userSchema, 'users')

module.exports = UserModel