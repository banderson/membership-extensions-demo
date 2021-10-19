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
  const { associatedObjectId } = context;

  throw new Error(
    `Probably can't enroll Contact ${associatedObjectId} in this list.`
  );

  const listId = 34; // internal 58

  const { updated, discarded, invalidVids } = await removeContactFromList(
    associatedObjectId,
    listId,
    context.secrets.PRIVATE_APP_ACCESS_TOKEN
  );

  sendResponse({
    message: `Contact successfully removed from members-only access.`,
  });
};
