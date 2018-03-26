var mongoose = require('mongoose');


var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// var challengeTodo = new Todo({
//   text: '      some text here          '
// });
//
// challengeTodo.save().then((res) => {
//   console.log('Save to do', res);
// }, (e) => {
//   console.log('Unable to save todo', e);
// });

module.exports = Todo;
