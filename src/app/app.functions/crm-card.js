const axios = require('axios');

async function getMembersOfList(listId, token) {
  return axios
    .get(`https://api.hubspotqa.com/contacts/v1/lists/${listId}/contacts/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(result => {
      return result.data.contacts;
    });
}

async function isMemberOfList(vid, listId, token) {
  return getMembersOfList(listId, token).then(contacts => {
    return !!contacts.filter(contact => `${contact.vid}` === `${vid}`).length;
  });
}

exports.main = async (context = {}, sendResponse) => {
  // const hubspotClient = new hubspot.Client({
  //   accessToken: context.secrets.PRIVATE_APP_ACCESS_TOKEN,
  // });

  const { associatedObjectId } = context;

  const listId = 34;

  const isMember = await isMemberOfList(
    associatedObjectId,
    listId,
    context.secrets.PRIVATE_APP_ACCESS_TOKEN
  );

  let sections;
  let actions;
  let settingsAction;
  let primaryAction;
  if (isMember) {
    sections = [
      {
        type: 'alert',
        titleText: 'Already a Member',
        bodyText: 'This contact already has access to private content.',
        variant: 'info',
      },
      {
        type: 'button',
        onClick: {
          type: 'SERVERLESS_ACTION_HOOK',
          serverlessFunction: 'revoke',
          label: 'Revoke Access',
        },
        text: `Revoke Access`,
      },
    ];
    actions = [
      {
        type: 'CONFIRMATION_SERVERLESS_ACTION_HOOK',
        serverlessFunction: 'revoke',
        confirmationMessage:
          "Are you sure you want to revoke this user's site access?",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        associatedObjectProperties: ['protected_account'],
        label: 'Revoke access',
      },
      {
        type: 'IFRAME',
        width: 890,
        height: 748,
        uri: 'https://app.hubspotqa.com/contacts/99553819/lists/34',
        label: 'View Access List',
      },
      {
        type: 'IFRAME',
        width: 890,
        height: 748,
        uri: 'https://knowledge.hubspot.com/website-pages/require-member-registration-to-access-private-content',
        label: 'Knowledge Base',
      },
    ];
    settingsAction = {
      type: 'IFRAME',
      width: 890,
      height: 748,
      uri: 'https://app.hubspotqa.com/content/99553819/edit/43029448059/settings',
      label: 'Settings',
    };
  } else {
    sections = [
      {
        type: 'button',
        onClick: {
          type: 'SERVERLESS_ACTION_HOOK',
          serverlessFunction: 'grant',
          label: 'Grant Access',
        },
        text: `Grant Access`,
      },
    ];
    primaryAction = {
      type: 'IFRAME',
      width: 890,
      height: 748,
      uri: 'https://knowledge.hubspot.com/website-pages/require-member-registration-to-access-private-content',
      label: 'Learn More',
    };
  }

  sendResponse({
    results: [
      {
        objectId: 1,
        sections,
        title: `Membership Status`,
        actions,
      },
    ],
    settingsAction,
    primaryAction,
  });
};
