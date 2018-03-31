const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');

const app = express();
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


app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = app;
