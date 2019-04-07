const mongoose = require('mongoose');

const dbURL = process.env.MONGO_URL || 'mongodb://localhost:27017/test1234';

mongoose.connect(dbURL, {
    autoIndex: true,
    useNewUrlParser: true,
    useCreateIndex: true
});