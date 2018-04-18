const {SHA256} = require('crypto-js'); // We ejecting a property from this library
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//================ Example of HOW JSON Web Tokens workz! ================//
// var userID = {
//   id: '5ace4ebb37e876c106d6f3dc'
// };
//
// var token = jwt.sign(userID, 'saltsecret'); // this method takes ta data and returns the hashed ready!!
// console.log(token);
//
// var decoded = jwt.verify(token, 'saltsecret');
// console.log('Decoded value: ', decoded);
//
//
// //================ Example of HOW tokens workz! ================//
//
//
// var token = {
//   hash: SHA256(JSON.stringify(userID) + 'saltsecret').toString() //Salt secret creates a unique hashed value!
// }
//
// // Pretend that user changes the id...BUT don't HASH the salt !!!! it's stored only on our server!!
// userID = "5ace4f8137e876c106d6f3e1"
// token.hash = SHA256(JSON.stringify(userID)).toString();
//
// var resultHash = SHA256(JSON.stringify(userID) + 'saltsecret').toString();
// if(resultHash === token.hash) {
//   console.log('Data is fine');
// } else {
//   console.log('Data was changed..Be carefull');
// }

//================ Example of HOW bcrypt workz! ================//

var password = '123abc!'

bcrypt.genSalt(13, (err, salt) => { // If the number is bigger etc 100 the algorithm takes longer...
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPass = '$2a$13$8LeX8DujDNPB4PhL3AgDvuZRNH0n1XNIOoeF12/9ghHe5RDqVWzAO';

bcrypt.compare(password, hashedPass, (e, res) => {
  console.log(res);
});
