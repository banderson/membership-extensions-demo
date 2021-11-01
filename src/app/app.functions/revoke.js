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
    return result.data;
  });
}

exports.main = async (context = {}, sendResponse) => {
  const { associatedObjectId, secrets = {} } = context;

  await removeContactFromList(
    associatedObjectId,
    process.env.PORTAL_ID,
    secrets.PRIVATE_APP_ACCESS_TOKEN
  );

  sendResponse({
    message: `Access revoked, they've been removed from members-only access.`,
  });
};
