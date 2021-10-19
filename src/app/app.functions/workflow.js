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
  const { associatedObjectId, email = 'banderson@hubspot.com' } = context;

  // throw new Error(`Can't enroll contact ${associatedObjectId} with email ${email}`)

  const workflowId = 20708406;

  await enrollInWorkflow(
    workflowId,
    associatedObjectId,
    context.secrets.PRIVATE_APP_ACCESS_TOKEN
  );

  sendResponse({
    message: `Login link successfully sent via App Notification.`,
  });
};
