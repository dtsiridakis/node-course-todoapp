const expect = require('expect');
const request = require('supertest');

const app = require('./../server');
const Todo = require('./../models/todo');

beforeEach((done) => { // This function allow us to run some code before EACH TEST CASE!!!!!
  Todo.remove({}).then(() => {
    done(); // Only if we call done() proceeds to the test cases
  });
});

describe('POST / todos', () => {
  it('should create a new todo', (done) => {
    var text = 'some text to test'
    request(app)
      .post('/todos')
      .send({text}) // With this method we sending data along with request
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => { // Now we must check what we have store on mongodb.Thats why we require Todo up above
        if(err) {
          return done(err); // we call done and wrap up the test printing the error
        }
        Todo.find().then((todos) => { // We find all the todos inside the collection
          expect(todos.length).toBe(1); // Up above we clear the database with "beforeEach" and we have only one todo!!!
          expect(todos[0].text).toBe(text);
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
          expect(todos.length).toBe(0);
          done();
        },(err) => {
          return done(e);
        });
      });
  });
});
