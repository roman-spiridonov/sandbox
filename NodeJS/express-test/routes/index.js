var users = require('./users');

module.exports = function (app) {
    app.get('/', require('../middleware/hitCounter'), function (req, res) {  // post, delete, put, ...
        res.render("index", {footer: "The number of hits in current session: " + req.session.numberOfVisits});
    })
        .get('/login', require('./login').get)
        .post('/login', require('./login').post)
        .post('/logout', require('./logout').post);

    app.use('/users', users);
};
