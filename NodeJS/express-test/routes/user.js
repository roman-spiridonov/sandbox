var User = require('../models/user').User;

exports.get = function (req, res, next) {
  try{
    var id = new ObjectID(req.params.id);  // req.params.id is instance of ObjectID; throws exception for too short IDs
  } catch(e) {
    return next(404);
  }
  User.findById({_id: id}, function (err, user) {
    if(err) next(err);
    if(!user) next(404);

    res.json(user);
  });
};