const {ObjectID} = require('mongodb');
const Todo       = require('./../../models/todo');
const User       = require('./../../models/user');
const jwt        = require('jsonwebtoken');


//=== TODOS SEED DATABASE ===//


const todos = [{
  text: 'text 1',
  _id: new ObjectID()
}, {
  text: 'text 2',
  _id: new ObjectID(),
  completed: true,
  completedAt: 33
}];



const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); //Add some fake data to test GET Route
  }).then(() => {
    done(); // Only if we call done() proceeds to the test cases
  }).catch((e) => {
    done(e);
  });
}


//=== USERS SEED DATABASE ===//


const userOneId = new ObjectID;
const userTwoId = new ObjectID;

const users = [{
  _id: userOneId,
  email: 'james@example.com',
  password: 'useOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'mara@example.com',
  password: 'useTwoPass',
}];


const populateUsers = (done) => { // We dont use insertMany() because not triggers the .save()
  User.remove({}).then(() => {    // who enables the middleware and hashing the password;
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]) // This is a trick to ensure both user's was saved
  }).then(() => {
    done();
  }).catch((e) => {
    done(e);
  });
};


module.exports = {todos, populateTodos, users, populateUsers};
