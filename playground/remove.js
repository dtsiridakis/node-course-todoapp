const mongoose = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo');
const User = require('./../server/models/user');

const {ObjectID} = require('mongodb') // We destrucure this property from mongodb library
// we use this usefull method 'ObjectID.isValid()' to check the validation of the id

// Todo.remove({}).then((res) => { //Removes all the docks but it needs an argument inside not as .find()
//   console.log(res); //Don't return an object
// });

Todo.findOneAndRemove({_id: '5ac5e56acb3a4c5b538d8fb1'}).then((res) => {
  console.log(res); // This method removes the first match and you pass any argument
});                 // returns deleted object

Todo.findByIdAndRemove('5ac5e596cb3a4c5b538d8fc9').then((res) => {
  console.log(res); // This method works only with id
})                  // returns deleted object
