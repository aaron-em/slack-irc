var config = require('config')
  , express = require('express')
  , credentials = require('./credential')
  , IRC = require('./lib/irc')
  , Slack = require('./lib/slack')
  , ircClient
  , slackClient
  , httpListener
  , httpPort = process.env.PORT || 3000;

slackClient = new Slack(config, credentials.slack);
ircClient = new IRC(config);
httpListener = express();

ircClient.on('message', function(data) {
  slackClient.send(data.channel.slack, data.from, data.message);
});

ircClient.connect(function() {
  console.log('Connected to IRC as ' + config.irc.nick + '.');
});

httpListener.get('/', function(req, res) {
  res.status(200)
    .send('Hi there.');
});

httpListener.listen(httpPort, function() {
  console.log('Listening for HTTP connections on port ' + httpPort + '.');
});