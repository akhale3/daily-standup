# daily-standup
A standup bot for compiling standup answers daily and storing persistently

## Installation
1. Clone the repository.
```shell
git@github.com:akhale3/daily-standup.git
```
2. Install dependencies.
```shell
npm install
```

## Slack Setup (Optional)
1. Create an `IncomingWebhook` URL for Slack to post to a direct message or
channel by following the instructions on
[Slack](https://api.slack.com/incoming-webhooks#create_a_webhook).
2. Set the environment variable to the newly created webhook.
```shell
export SLACK_WEBHOOK_URL='https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
```

## Execution
![Execution Steps](screenshots/execution.png?raw=true "Execution Steps")
1. Run the following command from any location in the terminal.
```shell
standup
```
2. Press `Y + <Return>` or `<Return>` when asked if you would like to provide
your standup for the day. Press `N + <Return>` if you would like to skip the
day's standup.
3. For each subsequent question, press `<Return>` to open your default text
editor to fill in your standup details. You can format your response as a
single continuous sentence or a list with one item per line.
```shell
Coded foo
Debugged bar
Achieved baz
```
4. When all questions have been answered, the bot will format your responses as
Github and Slack-flavored Markdown. The Github Markdown will be saved as a `.md`
file in the `daily-standup/logs` directory with the filename formatted as the
current date - `YYYY-MM-DD.md`. The Slack Markdown will be posted to Slack via
the IncomingWebhook, if provided through `SLACK_WEBHOOK_URL`.

## Screenshots
### Github Markdown
![Github Markdown](screenshots/github.png?raw=true "Github Markdown")

### Slack Markdown
![Slack Markdown](screenshots/slack.png?raw=true "Slack Markdown")
