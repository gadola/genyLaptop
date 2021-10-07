const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


const accountSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        default: null
    }

})


// hash password with bcrypt
// node: callback should be a normal funciton -> use "this"
accountSchema.pre('save', async function (next) {
    try {
        const saltRounds = parseInt(process.env.SALT_ROUND)
        // hashing password
        const hashPassword = await bcrypt.hash(this.password, saltRounds)
        this.password = hashPassword
        next()
    } catch (error) {
        next(error)
    }
})

const AccountModel = mongoose.model('account', accountSchema, 'accounts')

module.exports = AccountModel;
