var request = require('request')
  , EventEmitter = require('events').EventEmitter
  , util = require('util');

var Slack = function(config, token) {
  EventEmitter.call(this);
  this.config = config;
  this.token = token;
};
util.inherits(Slack, EventEmitter);

Slack.prototype.send = function(channel, from, message) {
  request.post(
    {
      uri: this.config.slack.webhook.uri + this.token,
      body: JSON.stringify({
        'channel': channel,
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

Slack.prototype.receive = function(message) {
};

module.exports = Slack;