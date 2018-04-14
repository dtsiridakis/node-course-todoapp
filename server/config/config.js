var env = process.env.NODE_ENV || 'development';
console.log('env *******', env);

if(env === 'development') {
  console.log('you are on development');
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  console.log('you are on test');
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
