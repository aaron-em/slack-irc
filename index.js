var config = require('config')
  , credentials = require('./credential')
  , request = require('request')
  , irc = require('irc')
  , channels = []
  , client;

function ircToSlack(channel) {
  return function(from, message, raw) {
    request.post(
      {
        uri: config.slack.webhook.uri + credentials.slack,
        body: JSON.stringify({
          'channel': channel.slack,
          'username': from + ' via IRC',
          'icon_emoji': ':speech_balloon:',
          'text': message
        })
      },
      function(err, res) {
        if (err) console.log(err.message);
      }
    );
  };
}

function slackToIrc() {
  throw new Error('EUNIMPL');
}

function addChannelListeners() {
  config.channels.forEach(function(channel) {
    client.on('message' + channel.irc, ircToSlack(channel));
  });
};

client = new irc.Client(config.irc.host, config.irc.nick, {
  autoConnect: false,
  userName: config.irc.nick,
  port: config.irc.port || 6667,
  channels: config.channels.map(function(c) { return c.irc; }),
  debug: true
});

client.on('registered', function(msg) {
  console.log('Registered');
  console.log(msg);
});

client.on('error', function(err) {
  console.log(err);
});

client.connect(function() {
  console.log('Connected!');
  addChannelListeners();
});