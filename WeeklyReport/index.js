require('dotenv/config');

const { buildReport } = require('./src/buildReport');

module.exports = async function (context, myTimer) {
  const timeStamp = new Date().toISOString();

  if (myTimer.IsPastDue) {
    context.log('JavaScript is running late!');
  }

  try {
    buildReport(context, 'weekly');
  } catch (err) {
    context.log(err);
    process.exit(-1);
  }
  context.log('Timer trigger function ran at', timeStamp);
};

// 0 11 * * MON
