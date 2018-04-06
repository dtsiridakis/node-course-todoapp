const expect = require('expect');
const request = require('supertest');

const app = require('./../server');
const Todo = require('./../models/todo');

const {ObjectID} = require('mongodb')

var todos = [{
  text: 'text 1',
  _id: new ObjectID()
}, {
  text: 'text 2',
  _id: new ObjectID(),
  completed: true,
  completedAt: 33
}];

beforeEach((done) => { // This function allow us to run some code before EACH TEST CASE
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); //Add some fake data to test GET Route
  }).then(() => {
    done(); // Only if we call done() proceeds to the test cases
  }).catch((e) => {
    done(e);
  });
});

describe('POST / todos', () => {
  it('should create a new todo', (done) => {
    var text = 'something to test'
    request(app)
      .post('/todos')
      .send({
        text: text
      }) // With this method we sending data along with request
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => { // Now we must check what we have store on mongodb.Thats why we require Todo up above
        if(err) {
          return done(err); // we call done and wrap up the test printing the error
        }
        Todo.find().then((todos) => { // We find all the todos inside the collection
          expect(todos.length).toBe(3); // Up above we clear the database with "beforeEach" and we have only one todo!!!
          expect(todos[2].text).toBe(text);
          done();
        }).catch((e) => {
          return done(e);
        });
      });
  });
  // A test that confirms that we dont save a bad data file
  it('Should not save bad data file', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        },(err) => {
          return done(e);
        });
      });
  });
});

describe('GET /todos', () => {
  it('Should show todos properly', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.dbfiles.length).toBe(2)
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should send the correct data', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('Should return 404 if todo not found on db', (done) => {
    request(app)
      .get(`/todos/${new ObjectID()}`)
      .expect(404)
      .end(done)
  });

  it('Should return 404 for strange object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  });
});

describe('DELETE /todo/:id', () => {
  it('Should delete the todo', (done) => {
    request(app)
      .delete(`/todos/${todos[1]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((res) => {
          expect(res.length).toBe(1);
          return Todo.findById(todos[1]._id)
        }).then((res) => {
          expect(res).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should return 404 if id not found on db', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for strange object ids', (done) => {
    request(app)
      .delete(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todo/:id', () => {
  it('Should update the todo', (done) => {
    var id = todos[0]._id;
    var update = {text: 'Updated', completed: true}

    request(app)
      .patch(`/todos/${id}`)
      .send(update)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(update.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((err, res) => {
        if(err) {
          done(err);
        }

        Todo.findById(id).then((res) => {
          expect(res.text).toBe(update.text);
          expect(res.completed).toBe(true);
          expect(res.completedAt).toBeA('number');
          done()
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    var id = todos[1]._id;
    var update = {text: 'Updated again', completed: false}
    request(app)
      .patch(`/todos/${id}`)
      .send(update)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(update.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((err, res) => {
        if(err) {
          done(err);
        }

        Todo.findById(id).then((res) => {
          expect(res.text).toBe(update.text);
          expect(res.completed).toBe(false);
          expect(res.completedAt).toNotExist();
          done()
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('Should return 404 if id not found on db' ,(done) => {
    request(app)
      .patch(`/todos/${new ObjectID()}`)
      .expect(404)
      .end(done);
  });
  it('Should return 404 for strange object ids' ,(done) => {
    request(app)
      .patch(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});
