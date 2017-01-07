var User = require('../models/user').User;

exports.get = function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
};