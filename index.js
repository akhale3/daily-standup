#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const json2md = require('json2md');
const fs = require('fs');
const promisify = require('util').promisify;
const appendFileAsync = promisify(fs.appendFile);
const os = require('os');
const { IncomingWebhook } = require('@slack/client');

const prompts = [{
  name: 'confirmation',
  message: 'Do you wish to provide your standup today?',
  type: 'confirm'
}, {
  name: 'yesterday',
  message: 'What did you accomplish yesterday?',
  type: 'editor'
}, {
  name: 'today',
  message: 'What do you plan to accomplish today?',
  type: 'editor'
}, {
  name: 'obstacles',
  message: 'Do you have any obstacles? If yes, please list them.',
  type: 'editor'
}];

inquirer.prompt(prompts[0])
  .then(answers => { // Ask questions on CLI
    if (!answers.confirmation) {
      throw new Error('confirmation');
    }

    return inquirer.prompt(prompts.slice(1));
  })
  .then(answers => { // Format Github and Slack flavored Markdown
    let md = [];
    let answer = '';
    const today = (new Date()).toDateString();
    let slackMessage = `*${today}*`;
    slackMessage += '\n\n';

    md.push({
      h1: today
    });

    prompts.slice(1).forEach(prompt => {
      // Github
      md.push({
        h2: prompt.message
      });
      
      answer = answers[prompt.name].trim().split('\n');

      md.push({
        ul: answer.filter(line => line.length)
      });

      // Slack
      slackMessage += `*${prompt.message}*`;
      slackMessage += '```';
      slackMessage += answer.map(a => `- ${a}`).join('\n');
      slackMessage += '```';
      slackMessage += '\n';
    });

    return Promise.all([
      json2md.async(md),
      Promise.resolve(slackMessage)
    ]);
  })
  .then(markdown => { // Save Github flavored Markdown
    const filename = (new Date()).toISOString().slice(0, 10);

    appendFileAsync(`${__dirname}/logs/${filename}.md`, markdown[0] + os.EOL);

    return Promise.resolve(markdown[1]);
  })
  .then(slackMessage => { // Post to Slack
    const url = process.env.SLACK_WEBHOOK_URL;

    if (!url) {
      return undefined;
    }

    const webhook = new IncomingWebhook(url);

    return webhook.send(slackMessage);
  })
  .catch(err => {
    if (!/confirmation/.test(err)) {
      console.error(err);
    }
  });
