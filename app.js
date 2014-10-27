var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var config = JSON.parse(
    fs.readFileSync(__dirname + '/config.json', 'utf-8'));
var routes = require(__dirname + '/routes/index');
var app = express();

// socket setup.
var sockjs = require('sockjs');
var channel = sockjs.createServer();
var clients = {};

function broadcast(message) {
  var client;
  for (client in clients){
    clients[client].write(JSON.stringify(message));
  }
}

// initialize the view
var currentView = config.views.start;
var backStack = [];

channel.on('connection', function(conn) {
  console.log('connected!');
  clients[conn.id] = conn;
  conn.write(JSON.stringify(currentView));

  conn.on('data', function(instruction) {
    var valid = false;
    if (instruction === 'back') {
      if (backStack.length > 0) {
        currentView = backStack.pop();
        valid = true;
      }
    }
    else if (config.views[instruction]) {
      backStack.push(currentView);
      currentView = config.views[instruction];
      valid = true;
    }

    if (valid) {
      broadcast(currentView);
    }
  });

  conn.on('close', function() {
    delete clients[conn.id];
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

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


module.exports = {
  app: app,
  channel: channel
};
