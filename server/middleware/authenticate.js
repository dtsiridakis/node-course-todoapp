const User = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth'); // This is the token that user send us when want to go to private route

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject(); // if this runs automaticly go to .catch(e) method ;)
    }
    req.user = user; // We modify the req. object to use it on other routes...like the /users/me  route....
    req.token = token; // This has no usage but we tackle it if is needed on some route.
    next();
  }).catch((e) => {
    res.status(401).send(); // 401 is authentication error!
  });
};

module.exports = {authenticate};
