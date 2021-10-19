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
    const { updated, discarded, invalidVids } = result.data;
    return { updated, discarded, invalidVids };
  });
}

exports.main = async (context = {}, sendResponse) => {
  const { associatedObjectId, secrets = {} } = context;

  const listId = 34;

  const { updated, discarded, invalidVids } = await addContactToList(
    associatedObjectId,
    listId,
    secrets.PRIVATE_APP_ACCESS_TOKEN
  );

  sendResponse({
    message: `Access granted, they'll receive an email to complete registration.`,
  });
};
