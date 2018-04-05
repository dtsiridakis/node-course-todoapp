const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');

const {ObjectID} = require('mongodb');

const app = express();
const port = process.env.PORT || 3000; //This line give access to listen port on HEROKU or Local 3000 if HEROKU not working
app.use(bodyParser.json());


app.post('/todos', (req, res) => {
  let someTodo = new Todo({
    text: req.body.text
  });

  someTodo.save().then((todo) => {
    res.send(todo);
  }, (e) => {
    res.status(400).send(e);
  });
});


app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      dbfiles: todos
    }); //It's best to send objects instead of arrays back!!!!
  }, (err) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => { // The :id its our variable to store the data from the url.. can be anything
  var id = req.params.id;
  if(!ObjectID.isValid(id)) { // We validate the id
    res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send(); // We check if is on database
    }
    res.send({todo});
  }).catch((e) => {
    return res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send(todo);
  }, (e) => {
    res.status(400).send();
  })
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = app;
