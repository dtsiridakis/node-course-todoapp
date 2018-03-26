// // const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb');
//strange but LEARN IT!!!!


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Error to connect with database');
  }
  console.log('You connect fine');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5aa8048ffb0f8609aebcae10');
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to feth todos', err)
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos counted as: ${count}`);
  // }, (err) => {
  //   console.log('Unable to feth the number of count', err)
  // });

  // db.collection('Users').find({name: "Dimitrios"}).toArray().then((users) => {
  //   console.log('Users');
  //   console.log(JSON.stringify(users, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch Dimitrios data');
  // });

  db.collection('Users').find({name: 'Mara'}).toArray().then((result) => {
    console.log(result);
  }, (err) => {
    console.log('Unable to Connect');
  });

  // db.close();
});
