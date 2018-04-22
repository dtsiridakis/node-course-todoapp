const expect = require('expect');
const request = require('supertest');

const app = require('./../server');
const Todo = require('./../models/todo');
const User = require('./../models/user');

const {ObjectID} = require('mongodb')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


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
        expect(res.body.todo.completedAt).toBeA('string');
      })
      .end((err, res) => {
        if(err) {
          done(err);
        }

        Todo.findById(id).then((res) => {
          expect(res.text).toBe(update.text);
          expect(res.completed).toBe(true);
          expect(res.completedAt).toBeA('string');
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
      .patch('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('Should return with the right token the user', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return empty without the right token', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('Should create a user', (done) => {
    var email = 'tsiridakis@yahoo.gr';
    var password = '123kkk@';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist() // we select with headers['x-auth']
        expect(res.body._id).toExist()       // because this headers.x-auth is not valid!
        expect(res.body.email).toBe(email)
      })
      .end((err) => {
        if (err) {
          done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('Should send validation errors for valid data', (done) => {
    var email = 'tsiri.gr';
    var password = '12£';
      request(app)
       .post('/users')
       .send({email})
       .expect(400)
       .end((err) => {
        if (err) {
          done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toNotExist();
          done();
        });
       });
  });

  it('Should not save already email user', (done) => {
    var email = users[1].email;
    var password = '123456£';
      request(app)
       .post('/users')
       .send({email, password})
       .expect(400)
       .end(done);
  });
});

describe('POST /users/login', () => {
  it('Should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist() // we select with headers['x-auth']
        expect(res.body._id).toExist()       // because this headers.x-auth is not valid!
        expect(res.body.email).toBe(users[1].email)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({access: 'auth', token: res.headers['x-auth']});
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not login user with wrong ceredentials', (done) => {
      request(app)
      .post('/users/login')
      .send({email: users[1].email, password: "121212"})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});