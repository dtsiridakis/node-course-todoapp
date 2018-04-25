var env = process.env.NODE_ENV || 'development';
console.log('env *******', env);

if(env === 'development' || env === 'test') {
	var config = require('./config.json');
	var envConfig = config[env];// Only with bracket we can put variables to search
	
	console.log(envConfig);

	Object.keys(envConfig).forEach((key) => { // Object.keys is javaScript method and from an object
		process.env[key] = envConfig[key]; // Returns an Array with the properties
	});
};

// OLD CODE//
// if(env === 'development') {
//   console.log('you are on development');
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   console.log('you are on test');
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
