var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./libs/logger')(module);
var methodOverride = require('method-override');
var errors = require('./errors');
var mongoose = require('./libs/mongoose');

var app = express();
app.set('port', config.get('port'));

// Templating Engine
app.engine('ejs', require('ejs-locals')); // *.ejs to be handled by ejs-locals. Adds: layout partial block.
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

// Middlewares (handlers w/ next callback)
// In Express 3, built-in middlewares come from connect framework: http://www.senchalabs.org/connect/.
// In Express 4+, they come as separate npm modules.
app.use(express.favicon());  // /favicon.ico
if(app.get('env') == 'development') {  // logs requests
  app.use(express.logger({/*immediate: true, */format: 'dev'}));  // by default (immediate: false), overrides res.end
} else {
  app.use(express.logger('default'));
}
//app.use(express.bodyParser());  // form application/json, data in req.body
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride());
app.use(express.cookieParser());  // req.headers --> req.cookies
var MongoStore = require('connect-mongo')(express);  // use options from mongoose
app.use(express.session({
  secret: config.get('session:secret'),  // ABC6314764613858791365.SHA256(secret+salt) -- cookie.sig
    // sig is used for stamping user data saved in cookies, e.g. points: 1000.SHA256(secret+salt)
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({mongooseConnection: mongoose.connection})  // session storage using connect-mongodb module
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

// Routing
app.use(app.router);

require('./routes')(app);

app.use('/static', express.static(path.join(__dirname, 'public')));

// Global error handler
app.use(function(err, req, res, next) {  // middleware for errors, fires on next(Error) or throw
  if(typeof err == 'number') {  // next(400)
    err = new errors.HttpError(err);
  }

  if(err instanceof errors.HttpError) {
    res.sendHttpError(err);
  } else if ('development' == app.get('env')) {
    next(err);
  } else {   // NODE_ENV == 'production'
    log.error(err);
    err = new errors.HttpError(500);
    res.sendHttpError(err);
  }
});


// Start server
http.createServer(app).listen(app.get('port'), function(){
  log.info('Express server listening on port ' + app.get('port'));
});
