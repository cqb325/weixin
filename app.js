var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var ctxpvd = require('./ctxpvd');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  //if (req.url.indexOf('/assets/') === 0 || req.url.indexOf('/bootstrap/') === 0 || req.url.indexOf('/javascripts/') === 0 || req.url.indexOf('/upload/') === 0) {
    res.setHeader('Cache-Control', 'public, max-age=345600'); // 4 days
    res.setHeader('Expires', new Date(Date.now() + 345600000).toUTCString());
  //}
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({store: new RedisStore({
  port: "6379",
  host: "localhost",
  db: 0,
  prefix: "weixinSession:"
}), secret: 'cqb325',cookie: {maxAge:1800000}, resave: false, saveUninitialized: false}));


//app.use('/admin.*',function(req, res, next) {
//  console.log(111);
//  if(!req.session.user){
//    res.redirect('/admin');
//  }
//  next();
//});

ctxpvd.initRouters(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log(req.url);
  res.render('404');
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
