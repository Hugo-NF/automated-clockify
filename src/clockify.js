const { default: axios } = require('axios');
const { clockify, clockifyReports } = require('./axios');

const getCurrentUser = async () => clockify.get('/user');

const findAllUsersOnWorkspace = async (workspaceId) => clockify.get(`/workspaces/${workspaceId}/users`);

const detailedReport = async (workspaceId, requestBody) => clockifyReports.post(
  `/workspaces/${workspaceId}/reports/detailed`,
  requestBody,
  { responseType: 'stream' },
);

module.exports = {
  getCurrentUser,
  findAllUsersOnWorkspace,
  detailedReport,
};
