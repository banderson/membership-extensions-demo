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
  const { associatedObjectId } = context;

  const listId = 34; // internal 58

  const { updated, discarded, invalidVids } = await addContactToList(
    associatedObjectId,
    listId,
    context.secrets.PRIVATE_APP_ACCESS_TOKEN
  );

  sendResponse({
    message: `Contact successfully granted access.`,
  });
};
