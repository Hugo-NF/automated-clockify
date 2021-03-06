require('dotenv/config');

const { buildReport } = require('./src/buildReport');

buildReport('weekly');
