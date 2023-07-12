const name = 'hello';
const age = 15;

console.log('welcome to the World');

const mongo = require('mongo');

const launch = require('launch-editor')

launch(
  // filename:line:column
  // both line and column are optional
  'foo.js:2:2',
  // try specific editor bin first (optional)
  'pycharm',
  // callback if failed to launch (optional)
  (fileName, errorMsg) => {
    // log error if any
    console.log(fileName, errorMsg);
  }
)