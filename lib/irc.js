var EventEmitter = require('events').EventEmitter
  , util = require('util')
  , irc = require('irc');

var IRC = function(config) {
  EventEmitter.call(this);

  this.config = config;
  this.connected = false;
  this.ircClient = undefined;

  this.setupClient();
};
util.inherits(IRC, EventEmitter);

IRC.prototype.setupClient = function() {
  var self = this
    , ircClient;

  if (typeof this.ircClient !== 'undefined') {
    throw new Error('Tried to setupClient() more than once');
  }

  ircClient = new irc.Client(this.config.irc.host, this.config.irc.nick, {
    autoConnect: false,
    userName: this.config.irc.nick,
    port: this.config.irc.port || 6667,
    channels: this.config.channels.map(function(c) { return c.irc; }),
    debug: this.config.irc.debug || false
  });

  this.config.channels
    .forEach(function(channel) {
      ircClient.on('message' + channel.irc, function(from, message, raw) {
        self.receive(channel, from, message, raw);
      });
    });

  ircClient.on('error', function(err) {
    self.handleError(err);
  });

  this.ircClient = ircClient;
};

IRC.prototype.handleError = function(err) {
  throw err;
};

IRC.prototype.connect = function(cb) {
  if (typeof this.ircClient === 'undefined') {
    this.setupClient();
  }

  this.ircClient.connect(function() {
    if (typeof cb === 'function') {
      cb();
    }
  });
};

IRC.prototype.disconnect = function(cb) {
  var self = this;

  if (typeof this.ircClient === 'undefined') {
    // already disconnected
    if (typeof cb === 'function') {
      cb();
    }
  } else {
    this.ircClient.disconnect(function() {
      self.ircClient = undefined;
      if (typeof cb === 'function') {
        cb();
      }
    });
  }
};

IRC.prototype.send = function(message) {
  throw new Error('EUNIMPL');
};

IRC.prototype.receive = function(channel, from, message, raw) {
  this.emit('message', {
    channel: channel,
    from: from,
    message: message,
    raw: raw
  });
};

module.exports = IRC;