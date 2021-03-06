const { clockify, clockifyReports } = require('./axios');

const getCurrentUser = async () => clockify.get('/user');

module.exports = {
  getCurrentUser,
};
