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

// expects command in form of 'GET /repos/:owner/:repo/compare/:base...:head'
function generate (command) {
  var parts = command.split(' '), // split into ['GET', '/repos/:owner/:repo/compare/:base...:head']
      method = parts[0],
      turl = parts[1],
      args, body;

  // Get command arguments:

    // split into ['repos', ':owner', ':repo', 'compare', ':base...:head']
    args = turl.split('/');
    // filter to [':owner', ':repo', ':base...:head']
    args = args.filter(function(val) {
      return val.indexOf(':') !== -1;
    });
    // reduce to [':owner', ':repo' ':base', ':head']
    if (args.length > 1) {
      args = args.reduce(function (last, curr, i) {
        if (i===1) {
          last = last.split('...');
        }
        return last.concat(curr.split('...'));
      });
    }
    // map to ['owner', 'repo' 'base', 'head']
    args = args.map(function(curr) {
      return curr.slice(1);
    })

  // return request generator
  return function () {
    var req = {};
    var url = turl;
    var parameters;
    var count = arguments.length; // number of arguments passed to function
    var expectedCount = args.length; // expected number of arguments

    // match up arguments
    for (var i = 0; i < expectedCount; i++) {
      var key = args[i],
          val = arguments[i];
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        url = url.replace(':'+key, val);
      } else {
        console.error('Expecting string for', args[i] ,'argument. Instead got', typeof val, val);
      }
    }

    // construct request
    req.headers = { 'User-Agent': 'ghapi' };
    req.method = method;
    req.url = 'https://api.github.com'+url;
    req.json = true;
    req.withCredentials = false;

    // handle parameters

    if (count > expectedCount) {
      parameters = arguments[count-1];

      if (parameters.auth) {
        req.auth = parameters.auth;
        delete parameters.auth;
      }
    } else if (count < expectedCount) {
      var missing = args.slice(expectedCount - count, expectedCount).join(', ');
      console.error('Missing arguments:', missing);
    }

    if (typeof parameters === 'object') {
      if (method === 'GET') {
        req.url += '?'+qs.stringify(parameters);
      } else {
        req.headers['Content-Type'] = 'application/json';
        req.body = parameters;
      }
    }

    return req;
  }
}
