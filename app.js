var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var mongoose        = require('mongoose');
var helpers         = require('express-helpers');

var beaconController  = require('./controllers/beacon_controller');
var clientController  = require('./controllers/client_controller');
var storeController   = require('./controllers/store_controller');
var areaController    = require('./controllers/area_controller');
var loginController   = require('./controllers/login_controller');
var app               = express();

//=============================================================================================================//
//====== App CONFIGURATION ====================================================================================//
//=============================================================================================================//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
helpers(app);// set view helpers for EJS

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride()); 				// simulate DELETE and PUT
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//===============================//
//====== DB CONFIGURATION =======//
//===============================//

console.log(process.env.MONGOHQ_URL);
//'mongodb://heroku:-IY7qZns1g-mcGfYpV29JVjwjMmmYu_v5ITVPCW1gPQjCYakIOrrmq7z0lE3PelCJJj3GgCLkohxAB28LzWF5Q@kahana.mongohq.com:10092/app26226186';
var mongoUri = process.env.MONGOHQ_URL || process.env.MONGOLAB_URI ||'mongodb://localhost/beardb';
mongoose.connect(mongoUri); // connect to our database

//=============================================================================================================//
//====== Controllers CONFIGURATION ============================================================================//
//=============================================================================================================//

app.use('/', loginController);
app.use('/clients', clientController);
app.use('/clients/:clientId/stores', storeController);
app.use('/clients/:clientId/stores/:storeId/areas', areaController);

//=============================================================================================================//
//====== Error Handlers CONFIGURATION =========================================================================//
//=============================================================================================================//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
