const axios = require('axios');

const clockify = axios.create({
  baseURL: process.env.CLOCKIFY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': process.env.CLOCKIFY_API_KEY,
  },
});

const clockifyReports = axios.create({
  baseURL: process.env.CLOCKIFY_REPORTS_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': process.env.CLOCKIFY_API_KEY,
  },
});

module.exports = {
  clockify,
  clockifyReports,
};
