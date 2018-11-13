'use strict';

const config = require('./config');
const Botmaster = require('botmaster');
const SlackBot = require('botmaster-slack');
const botmaster = new Botmaster();
const middleware = require('./middleware'); 

const slackBot = new SlackBot(config.slackSettings);
botmaster.addBot(slackBot);

botmaster.use(middleware.standup);

botmaster.on('error', (bot, err) => {
  console.log(err.stack);
});
