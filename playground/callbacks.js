var maths = (a, b, callback) => {
  setTimeout(() => {
      callback(a * b);
  }, 2000);
}

maths(2, 3, (res) => {
  var truth = res * 3;
  setTimeout(() => {
    console.log(truth);
  },2000);
});
