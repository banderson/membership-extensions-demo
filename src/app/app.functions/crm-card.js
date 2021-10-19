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

  const { associatedObjectId, hs_emailconfirmationstatus, hs_content_membership_registered_at } = context;

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

  if (!hs_emailconfirmationstatus || hs_emailconfirmationstatus === 'Confirmation Pending') {
    sections = [
      {
        type: 'alert',
        titleText: 'Email Delivery Blocked',
        bodyText: `Resending registration email won't work. See knowledgebase article for details.`,
        variant: 'danger',
      },
      {
        type: 'button',
        onClick: {
          type: 'IFRAME',
          width: 1200,
          height: 750,
          uri: 'https://knowledge.hubspot.com/email/what-is-the-marketing-email-confirmation-status-contact-property',
          label: 'Learn more',
        },
        text: `Learn more`,
      },
      {
        type: 'button',
        onClick: {
          type: 'SERVERLESS_ACTION_HOOK',
          serverlessFunction: 'workflow',
          label: 'Notify Contact',
        },
        text: `Notify Contact`,
      },
    ];

  } else if (isMember && hs_content_membership_registered_at) {
    sections = [
      {
        type: 'alert',
        titleText: 'Fully Registered',
        bodyText: 'This contact has full access to private content.',
        variant: 'success',
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
        width: 1200,
        height: 750,
        uri: 'https://app.hubspotqa.com/contacts/99553819/objects/0-1/views/1003073/list',
        label: 'View Access List',
      },
      {
        type: 'IFRAME',
        width: 1200,
        height: 750,
        uri: 'https://knowledge.hubspot.com/website-pages/require-member-registration-to-access-private-content',
        label: 'Knowledge Base',
      },
    ];
    settingsAction = {
      type: 'IFRAME',
      width: 1200,
      height: 750,
      uri: 'https://app.hubspotqa.com/content/99553819/edit/43256011354/settings',
      label: 'Settings',
    };

  } else if (isMember) {
    sections = [
      {
        type: 'alert',
        titleText: 'Awaiting Registration',
        bodyText: 'Contact was granted access, but has not yet registered.',
        variant: 'warning',
      },
      {
        type: 'button',
        onClick: {
          type: 'SERVERLESS_ACTION_HOOK',
          serverlessFunction: 'workflow',
          label: 'Send Reminder',
        },
        text: `Send Reminder`,
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
        width: 1200,
        height: 750,
        uri: 'https://app.hubspotqa.com/contacts/99553819/objects/0-1/views/1003073/list',
        label: 'View Access List',
      },
      {
        type: 'IFRAME',
        width: 1200,
        height: 750,
        uri: 'https://knowledge.hubspot.com/website-pages/require-member-registration-to-access-private-content',
        label: 'Knowledge Base',
      },
    ];
    settingsAction = {
      type: 'IFRAME',
      width: 1200,
      height: 750,
      uri: 'https://app.hubspotqa.com/content/99553819/edit/43256011354/settings',
      label: 'Settings',
    };
  } else {
    sections = [
      {
        type: 'alert',
        titleText: 'Public content only',
        bodyText: 'This contact has not registered, so can only access public pages.',
        variant: 'info',
      },
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
      width: 1200,
      height: 750,
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
