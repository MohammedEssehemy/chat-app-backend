const createError = require('http-errors');
const userModel = require('../models/user');


module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) return next(createError(401));
        const [, token] = req.headers.authorization.split(' ');
        const user = await userModel.verifyToken(token);
        if (!user) next(createError(401));
        req.user = user;
        // call next
        next()
    } catch (err) {
        debugger;
        next(createError(401));
    }
}