const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');

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

//========= To add instance methods on our schema we pass it like This into the .methods object

UserSchema.methods.toJSON = function () {
  var user = this;
  // console.log(user);
  // var userObject = user.toObject() // this method takes the mongoose variable and converting it to regular object
  // console.log(userObject);
  return _.pick(user, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () { //we use regular function to use keyword this
  var user = this;
  var access = 'auth';
  var userID = user._id;
  var token = jwt.sign({userID, access}, 'abc123');
  user.tokens = user.tokens.concat([{access, token}]);
  // return user.save().then(() => {
  //   return token;
};

//========== To add model methods on our schema we pass it like This into the .statics object

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject(); // Less code to reject promises
  }

  return User.findOne({
    _id: decoded.userID,
    'tokens.access': 'auth',// **Importand** when we queriying nested info we must wrapped in quotes!!!!!
    'tokens.token': token  // on Mongoose and Mongodb
  });
};

//========== To add a mongoose middleware before a certain function starts or ends like here!!
//========== Also remember that this middware executes before each save()!!
UserSchema.pre('save', function(next) { // Don't forget NEXT is middleware!!
  var user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(13, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});


var User = mongoose.model('User', UserSchema );

// EXAMPLE TO UNDERSTAND HOW THE KEYWORD THIS WORKS!!
// var skato = new User();
// console.log(skato.generateAuthToken);

module.exports = User;
