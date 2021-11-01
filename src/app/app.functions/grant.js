const axios = require('axios');

async function addContactToList(vid, listId, token) {
  return axios({
    url: `https://api.hubapiqa.com/contacts/v1/lists/${listId}/add`,
    method: 'POST',
    data: { vids: [vid] },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(result => {
    return result.data;
  });
}

exports.main = async (context = {}, sendResponse) => {
  const { associatedObjectId, secrets = {} } = context;

  await addContactToList(
    associatedObjectId,
    process.env.LIST_ID,
    secrets.PRIVATE_APP_ACCESS_TOKEN
  );

  sendResponse({
    message: `Access granted, they'll receive an email to complete registration.`,
  });
};
