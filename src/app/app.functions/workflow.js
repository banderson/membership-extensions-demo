const axios = require('axios');

async function enrollInWorkflow(workflowId, vid, token) {
  return axios({
    url: `https://api.hubapiqa.com/automation/v2/workflows/${workflowId}/enrollments/contacts/${vid}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

exports.main = async (context = {}, sendResponse) => {
  const { associatedObjectId } = context;

  const workflowId = 20708406;

  await enrollInWorkflow(
    workflowId,
    associatedObjectId,
    context.secrets.PRIVATE_APP_ACCESS_TOKEN
  ).catch(error => {
    throw new Error(
      'Cannot execute worfklow: be sure "automation" scope is enabled'
    );
  });

  sendResponse({
    message: `Reminder notification sent.`,
  });
};
