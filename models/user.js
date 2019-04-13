const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const integerValidator = require('mongoose-integer');
const jwt = require('jsonwebtoken');
const util = require('util');

const signPromise = util.promisify(jwt.sign);
const verifyToken = util.promisify(jwt.verify);

const secretKey = process.env.JWT_SECRET || 'ejgrhjgerhjgergh';

const saltRounds = Number(process.env.SALT_ROUNDS) || 7;

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        hidden: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true,
        validate: validator.isEmail
    },
    age: {
        type: Number,
        integer: true,
        index: true,
        required: true,
        hidden: true,
        min: 18
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'n/a'],
        lowercase: true,
        default: 'n/a'
    },
    country: {
        type: String,
        enum: ['eg', 'uk'],
        required: true,
        lowercase: true,
    }
}, {
        toJSON: {
            transform: (doc, ret, options) => {
                delete ret.password;
                return ret;
            },
        }
    });


schema.plugin(integerValidator);

const hashPassword = (password) => bcrypt.hash(password, saltRounds);

schema.method('verifyPassword', function (password) {
    const currentUser = this;
    return bcrypt.compare(password, currentUser.password);
});


schema.static('verifyToken', async function (token) {
    const userModel = this;
    const decoded = await verifyToken(token, secretKey);
    const userId = decoded._id;
    return userModel.findById(userId)
});

schema.method('generateToken', function () {
    const currentUser = this;
    return signPromise({ _id: currentUser._id }, secretKey, {
        expiresIn: '2h'
    });
})


// schema.options.toJSON.transform = (doc, ret, options) => {
//     delete ret.password;
//     return ret;
// }


schema.pre('save', async function () {
    const currentUser = this;
    if (currentUser.isNew) {
        currentUser.password = await hashPassword(currentUser.password);
    }
})


const userModel = mongoose.model('User', schema);

module.exports = userModel;
