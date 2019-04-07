const express = require('express');
const path = require('path');
const createError = require('http-errors');
// const cookieParser = require('cookie-parser');
const cors = require('cors')
const logger = require('morgan');
require('./db');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// app.use((req, res, next) => {
//     res.set({
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'post',
//         'Access-Control-Allow-Headers': 'content-type'
//     })
//     if (req.method !== 'OPTIONS') return next();
//     res.send();
// });

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

// not found middleware
app.use((req, res, next) => {
    next(createError(404));
})

//error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.send(err);
})

module.exports = app;
