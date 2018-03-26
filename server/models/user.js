var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});


// var newUser = new User({
//   email: '  maradrak@yahoo.gr  '
// });
//
// newUser.save().then((res) => {
//   console.log(res);
// }, (e) => {
//   console.log('Cant save user');
// });

module.exports = User;
