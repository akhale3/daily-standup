'use strict';
const config = require(__dirname + '/../config');

const questions = {
  yesterday: 'What did you accomplish yesterday?',
  today: 'What do you plan to accomplish today?',
  obstacles: 'Do you have any obstacles?'
};

let sessions = {};

const format = (style, contents) => {
  if (style === 'slack') {
    let result = '';

    contents.forEach(content => {
      result += '*' + content.q + '*' + '\n';
      result += content.a + '\n';
    });

    return result;
  }

  if (style === 'github') {
    // TODO
  }

  return contents;
};

const standup = {
  type: 'incoming',
  name: 'slack-middleware-standup',
  controller: (bot, update) => {
    if (update.sender.id.split('.').pop() !== config.slackBotId) {
      sessions[update.sender.id] = sessions[update.sender.id] || {
        yesterday: {
          q: questions.yesterday
        },
        today: {
          q: questions.today
        },
        obstacles: {
          q: questions.obstacles
        }
      };

      sessions[update.sender.id].order = [
        sessions[update.sender.id].yesterday,
        sessions[update.sender.id].today,
        sessions[update.sender.id].obstacles
      ];

      sessions[update.sender.id].next = () => {
        let session = sessions[update.sender.id];
        let order = session.order;

        if (session.currentIndex === undefined) {
          session.currentIndex = 0;
          session.previousIndex = 0;
        } else {
          session.currentIndex++;
          session.previousIndex = session.currentIndex - 1;
        }

        let previous = order[session.previousIndex];
        previous.a = update.message.text;

        if (session.currentIndex < order.length) {
          let current = order[session.currentIndex];

          return current.q;
        }

        delete sessions[update.sender.id];

        return format('slack', order);
      };

      return bot.reply(update, sessions[update.sender.id].next());
    }
  }
};

module.exports = {
  standup
};
