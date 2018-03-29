const express = require('express');
const bodyParser = require('body-parser');



const mongoose = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');

const app = express();
app.use(bodyParser.json());


app.post('/todos', (req, res) => {
  let postmanTodo = new Todo({
    text: req.body.text
  });

  postmanTodo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => { //It's best to send objects instead of arrays back!!!!
    res.send({todos});
  }, (err) => {
    res.status(400).send(e);
  });
});


app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = app;
