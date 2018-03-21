// // const MongoClient = require('mongodb').MongoClient
const {
  MongoClient,
  ObjectID
} = require('mongodb');
//strange but LEARN IT!!!!


// var obj = new ObjectID;
// console.log(obj)
///With the above code we create new Object ID's


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Error to connect with database');
  }
  console.log('You connect fine');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    _id: '1312',
    name: 'Dimitrios',
    age: 30,
    location: 'Athens'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to connect to users', err);
    }
    // console.log(result.ops[0]._id.getTimestamp());
  });

  db.close();
});