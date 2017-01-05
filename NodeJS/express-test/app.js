var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./libs/logger')(module);

var app = express();
app.set('port', config.get('port'));

http.createServer(app).listen(app.get('port'), function(){
  log.info('Express server listening on port ' + app.get('port'));
});

// Middlewares (handler + next parameter)
app.use(function(req, res, next) {
  if(req.url == '/') {
    res.end('Hello');
  }
  next();
});

app.use(function(req, res, next) {
  if(req.url == '/test') {
    res.end('Test');
  }
  next();  // to next middleware
});

app.use(function(req, res, next) {
  if(req.url == '/forbidden') {
    return next(new Error("Access denied"));
  }
  next();  // to next middleware
});

app.use(function(req, res, next) {  // default middleware
  res.send(404, "Page not found");  // express extends req and res objects with new API functions
});

app.use(function(err, req, res, next) {  // middleware for errors, fires on next(Error) or throw
  if ('development' == app.get('env')) {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {   // NODE_ENV == 'production'
    res.send(500);
  }
});


// development only


/*
 var routes = require('./routes');
 var user = require('./routes/user');

 // all environments
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');
 app.use(express.favicon());
 app.use(express.logger('dev'));
 app.use(express.json());
 app.use(express.urlencoded());
 app.use(express.methodOverride());
 app.use(express.session({ secret: 'your secret here' }));
 app.use(app.router);
 app.use(express.static(path.join(__dirname, 'public')));

 app.get('/', routes.index);
 app.get('/users', user.list);
 */
