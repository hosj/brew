var express			= require('express');
var path			= require('path');
var favicon			= require('serve-favicon');
var logger			= require('morgan');
var cookieParser	= require('cookie-parser');
var bodyParser		= require('body-parser');
var mongo			= require('mongoskin');
var db				= mongo.db("mongodb://localhost:27017/beer", {native_parser:true}, {safe: true}, {strict: false});

var routes			= require('./routes/index');
var menu			= require('./routes/menu');
var recipes			= require('./routes/recipes');
var hops			= require('./routes/hops');
var fermentables	= require('./routes/fermentables');
var yeast			= require('./routes/yeast');
var newbrew			= require('./routes/newbrew');
var brewing			= require('./routes/brewing');
var fermenting		= require('./routes/fermenting');
var statistics		= require('./routes/statistics');
var drinks			= require('./routes/drinks');

var app				= express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use('/', routes);
app.use('/menu', menu);
app.use('/recipes', recipes);
app.use('/hops', hops);
app.use('/fermentables', fermentables);
app.use('/yeast', yeast);
app.use('/NewBrew', newbrew);
app.use('/brewing', brewing);
app.use('/statistics', statistics);
app.use('/fermenting', fermenting);
app.use('/drinks', drinks);

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
