require('dotenv/config');

const { buildReport } = require('./src/buildReport');

try {
  buildReport('weekly');
} catch (err) {
  console.log(err);
  process.exit(-1);
}
