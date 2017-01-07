var User = require('../models/user').User;
var errors = require('../errors');
var ObjectID = require('mongodb').ObjectId;
var checkAuth = require('../middleware/checkAuth');

module.exports = function (app) {
  app.get('/', require('../middleware/hitCounter'), function(req, res) {  // post, delete, put, ...
    res.render("index", { footer: "The number of hits in current session: " + req.session.numberOfVisits });
  });

  app.get('/users', checkAuth, require('./users').get);
  app.get('/user/:id', checkAuth, require('./user').get);

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);
  app.post('/logout', require('./logout').post);

};
