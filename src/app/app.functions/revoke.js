const axios = require('axios');

async function removeContactFromList(vid, listId, token) {
  return axios({
    url: `https://api.hubapiqa.com/contacts/v1/lists/${listId}/remove`,
    method: 'POST',
    data: { vids: [vid] },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(result => {
    const { updated, discarded, invalidVids, invalidEmails } = result.data;
    return { updated, discarded, invalidVids, invalidEmails };
  });
}

exports.main = async (context = {}, sendResponse) => {
  const { associatedObjectId, secrets = {} } = context;

  const listId = 34;

  const { updated, discarded, invalidVids } = await removeContactFromList(
    associatedObjectId,
    listId,
    secrets.PRIVATE_APP_ACCESS_TOKEN
  );

  sendResponse({
    message: `Access revoked, they've been removed from members-only access.`,
  });
};
