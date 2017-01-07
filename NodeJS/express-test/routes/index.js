var User = require('../models/user').User;
var errors = require('../errors');
var ObjectID = require('mongodb').ObjectId;
var checkAuth = require('../middleware/checkAuth');  // middleware to check that user is authenticated

module.exports = function (app) {
    app.get('/', require('../middleware/hitCounter'), function (req, res) {  // post, delete, put, ...
        res.render("index", {footer: "The number of hits in current session: " + req.session.numberOfVisits});
    })
        .get('/users', checkAuth, require('./users').get)
        .get('/user/:id', checkAuth, require('./user').get)
        .get('/login', require('./login').get)
        .post('/login', require('./login').post)
        .post('/logout', require('./logout').post);
};
