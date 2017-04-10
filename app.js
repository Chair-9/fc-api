var express = require('express');
var path = require('path');
require('dotenv').config();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const winston = require('winston');
var index = require('./routes/index');
var person = require('./routes/person');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/person', person);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var mongoose = require('mongoose');
var assert = require('assert');
var fs = require('fs');

var ca = [ fs.readFileSync(__dirname + "/servercert.crt") ];

var options = {
  mongos: {
    ssl: true,
    sslValidate: true,
    sslCA: ca
  }
};

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('open', function (err) {
  assert.equal(null, err);
  mongoose.connection.db.listCollections().toArray(function(err, collections) {
    assert.equal(null, err);
    collections.forEach(function(collection) {
      //console.log(collection);
      winston.info('[API STATUS] Mongo connected and ready to rock');

    });
    // mongoose.connection.db.close();
    // process.exit(0);
  })
});

// Let's open that connection
mongoose.connect(process.env.MONGO, options);

module.exports = app;
