// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb');
//strange but LEARN IT!!!!


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Error to connect with database');
  }
  console.log('You connect fine');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });


  //deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });


  // //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name: 'Dimitrios'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID("5aa95b3f3c54282f8f296e8a")
    }).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });

  // db.close();
});
