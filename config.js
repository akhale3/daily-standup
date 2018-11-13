'use strict';

require('dotenv').config();

module.exports = {
  slackSettings: {
    credentials: {
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      verificationToken: process.env.SLACK_VERIFICATION_TOKEN
    },
    webhookEndpoint: process.env.SLACK_WEBHOOK_ENDPOINT,
    storeTeamInfoInFile: true
  },
  slackBotId: process.env.SLACK_BOT_ID
};
