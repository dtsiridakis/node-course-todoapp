
const Todo = require('./../server/models/todo');
const User = require('./../server/models/user');

const {ObjectID} = require('mongodb') // We destrucure this property from mongodb library
// we use this usefull method 'ObjectID.isValid()' to check the validation of the id


var id = '6abfd49b14b882a03dff882a';
var userID = '5ab7fbb0f871c32f036f2299';

if(!ObjectID.isValid(id)) {
  console.log('This ID is not Valid');
}

if(!ObjectID.isValid(userID)) {
   return console.log('This ID is not Valid');
}

Todo.find({_id: id}).then((todos) => { // Returns all the array tha maching the querie
  console.log('Todos \n', todos); // Here if its not exist you get back an empty array!!
});

Todo.findOne({_id: id}).then((todo) => { // Returns only the first document tha maching the querie
  console.log('Todo \n', todo); // Here if its not exist you get back null
});

Todo.findById(id).then((todo) => { // Quering only with id
  if(!todo) {
    return console.log('This id not found'); // Handle error when an id cant be found!! but is valid!! has the right numbers
  }
  console.log('Todo with id \n', todo);
}).catch((e) => console.log(e));

User.findById(userID).then((user) => {
  if(!user) {
    return console.log('User with this id not found');
  }
  console.log('User with id \n', user);
}).catch((e) => console.log(e));
