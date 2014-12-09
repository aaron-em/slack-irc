var config = require('config')
  , credentials = require('./credential')
  , IRC = require('./lib/irc')
  , Slack = require('./lib/slack')
  , ircClient
  , slackClient;

slackClient = new Slack(config, credentials.slack);
ircClient = new IRC(config);

ircClient.on('message', function(data) {
  slackClient.send(data.channel.slack, data.from, data.message);
});

ircClient.connect(function() {
  console.log('Connected to IRC as ' + config.irc.nick + '.');
});
