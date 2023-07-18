require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const router = require('./routes/index.js');

const app = express();
const port = 3000;

// Set liquidjs as the default template engine
let { Liquid } = require('liquidjs');
app.engine('liquid', new Liquid().express());
app.set('views', './views');
app.set('view engine', 'liquid');

// Middleware
app.use(express.static('static'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', router);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.status = err.status || 500;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Start server
app.listen(port, () => {
    console.log(`CJRTwitter is listening on http://localhost:${port}`)
});
