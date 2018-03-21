// const MongoClient = require('mongodb').MongoClient
// const ObjectID = require('mongodb').ObjectID
const {MongoClient, ObjectID} = require('mongodb');
//strange but LEARN IT!!!!


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Error to connect with database');
  }
  console.log('You connect fine');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5aad49a20e98c57bf6708098')
  // }, {
  //   $set: { //$set is an operator
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((res) => {
  //   console.log(res);
  // });



  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5aa806772a35db09b28939b8')
  }, {
    $set: {
      name: 'Dimitrios'
    },
    $inc: {
      age: -32
    }
  }, {
    returnOriginal: false
  }).then((res) => {
    console.log(res);
  });

  db.close();
});
