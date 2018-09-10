#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const json2md = require('json2md');
const fs = require('fs');
const promisify = require('util').promisify;
const appendFileAsync = promisify(fs.appendFile);
const os = require('os');

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
  .then(answers => {
    if (!answers.confirmation) {
      throw new Error('confirmation');
    }

    return inquirer.prompt(prompts.slice(1));
  })
  .then(answers => {
    let md = [];
    let answer = '';
    const today = (new Date()).toDateString();

    md.push({
      h1: today
    });

    prompts.slice(1).forEach(prompt => {
      md.push({
        h2: prompt.message
      });
      
      answer = answers[prompt.name].trim().split('\n');

      md.push({
        ul: answer.filter(line => line.length)
      });
    });

    return json2md.async(md);
  })
  .then(markdown => {
    const filename = (new Date()).toISOString().slice(0, 10);

    return appendFileAsync(`${__dirname}/logs/${filename}.md`, markdown + os.EOL);
  })
  .catch(err => {
    if (!/confirmation/.test(err)) {
      console.error(err);
    }
  });
