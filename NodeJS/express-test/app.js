var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./libs/logger')(module);
var methodOverride = require('method-override');

var app = express();
app.set('port', config.get('port'));
app.engine('ejs', require('ejs-locals')); // *.ejs to be handled by ejs-locals. Adds: layout partial block.
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
// Middlewares (handlers w/ next callback)
// Most come from connect framework: http://www.senchalabs.org/connect/
app.use(express.favicon());  // /favicon.ico
if(app.get('env') == 'development') {  // logs requests
  app.use(express.logger({immediate: true, format: 'dev'}));  // by default (immediate: false), overrides res.end
} else {
  app.use(express.logger('default'));
}
//app.use(express.bodyParser());  // form application/json, data in req.body
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride());
//app.use(express.cookieParser());  // req.headers --> req.cookies
app.use(express.session({ secret: 'your secret here' }));

app.use(app.router);
app.get('/', function(req, res, next) {  // post, delete, put, ...
  res.render("index.ejs", {
    title: "ExpressJS"
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {  // middleware for errors, fires on next(Error) or throw
  if ('development' == app.get('env')) {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {   // NODE_ENV == 'production'
    res.send(500);
  }
});


/*
 var routes = require('./routes');
 var user = require('./routes/user');

 app.get('/', routes.index);
 app.get('/users', user.list);
 */

http.createServer(app).listen(app.get('port'), function(){
  log.info('Express server listening on port ' + app.get('port'));
});
