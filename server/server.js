require('./config/config');

const _              = require('lodash');
const express        = require('express');
const bodyParser     = require('body-parser');
const mongoose       = require('./db/mongoose');
const {ObjectID}     = require('mongodb');
const bcrypt         = require('bcryptjs');

const Todo           = require('./models/todo');
const User           = require('./models/user');
const {authenticate} = require('./middleware/authenticate');



const app = express();
const port = process.env.PORT; //This line give access to listen port on HEROKU or Local 3000 if HEROKU not working
app.use(bodyParser.json());

//+++++++++++ TODOS ROUTES +++++++++++//

app.post('/todos', authenticate, (req, res) => {
  let someTodo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  someTodo.save().then((todo) => {
    res.send(todo);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({
      dbfiles: todos
    }); //It's best to send objects instead of arrays back!!!!
  }, (err) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => { // The :id its our variable to store the data from the url.. can be anything
  var id = req.params.id;
  if(!ObjectID.isValid(id)) { // We validate the id
    res.status(404).send();
  }
  Todo.findOne({
    _id: id, 
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send(); // We check if is on database
    }
    res.send({todo});
  }).catch((e) => {
    return res.status(400).send();
  });
});

// app.delete('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id

//   if(!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }
  
//   Todo.findOneAndRemove({
//     _id: id,
//     _creator: req.user._id
//      }).then((todo) => {
//     if(!todo) {
//       return res.status(404).send();
//     }
//     res.send({todo});
//   }, (e) => {
//     res.status(400).send();
//   })
// });

app.delete('/todos/:id', authenticate, async (req, res) => {
  var id = req.params.id

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
       });

    if(!todo) {
      return res.status(404).send();
    } else {
      res.send({todo});
    }
      
  } catch (error) {
    res.status(400).send();
  }
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']) // This method from lodash ejects from req.body
  if(!ObjectID.isValid(id)) {                      // the properties that we want and saves it to body variable
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) { // We check if the body.completed is boolean with lodash method
    body.completedAt = new Date();    // and if its also true!! we create a completedAt with miliseconds from 1970
  } else {
    body.completed = false; //Else the completed is false and completedAt is null
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => { // new: true is like returnOriginal but is from mongoose
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(404).send();
  });
});

//+++++++++++ USERS ROUTES +++++++++++//

// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);
  
//   user.save().then(() => {
//     return user.generateAuthToken();
//   }).then((token) => {
//     res.header('x-auth', token).send(user);
//   }).catch((e) => {// x-auth is a custom header for specific purposes because JWT scheme.
//     res.status(400).send(e);
//   });
// });

app.post('/users', async (req, res) => {
  try {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  
  try {
    var body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (error) {
    res.status(400).send();
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = app;