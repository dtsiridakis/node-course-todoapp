const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _          = require('lodash');

// {
//   email: 'test@test.gr',
//   password: 'myPass123', //This plain text is hashing one time before stored to database as a big text string that this is stored
//   tokens: [{ // Tokens is an array with objects..it's object is a login token etc login from web or mobile
//     access: 'auth', //Specifies the Tokens type like authentication, Email verifications, Resetting passes
//     token: 'fdfsgghe23133!@#$#rdfs' //Actuall token value like pass and this gonna be back and forth with http req. for users to edit their todo's
//   }]
// }
var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: validator.isEmail
      },
      message: '{VALUE} is not a valid email!'
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    tokens: [{ // This feature is available only at mongoDB no at SQL
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  });
  //To add methods on our schema we pass it like This
  UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject() // this method takes the mongoose variable and converting it to regualr object

    return _.pick(userObject, ['_id', 'email']);
  };

  UserSchema.methods.generateAuthToken = function () { //we use regular function to use keyword this
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id, access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
      return token;
    });
  };


var User = mongoose.model('User', UserSchema );

// EXAMPLE TO UNDERSTAND HOW THE KEYWORD THIS WORKS!!
// var skato = new User();
// console.log(skato.generateAuthToken);

module.exports = User;
