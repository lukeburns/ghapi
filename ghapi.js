var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var commands = require('./commands');

module.exports = api;

function api () {
  var callback;

  // first argument is the command
  var command = Array.prototype.shift.apply(arguments);

  // last argument is callback, if it's a function
  if (typeof arguments[arguments.length-1] === 'function') {
    callback = Array.prototype.pop.apply(arguments);
  }

  // generate function that formats a request for the `request` library.
  var req = generate(commands[command]);

  // call request with callback and return request stream
  return request(req.apply(null, arguments), callback);
} 
