require('dotenv/config');

const { buildReport } = require('./src/buildReport');

module.exports = async function (context, myTimer) {
  const timeStamp = new Date().toISOString();

  if (myTimer.IsPastDue) {
    context.log('JavaScript is running late!')
  }

  try {
    buildReport('weekly');
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
  context.log('JavaScript timer trigger function ran!', timeStamp);
};

// 0 11 * * MON
