var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var commands = require('./commands');

module.exports = req;

var compare = makeReq('GET /repos/:owner/:repo/compare/:base...:head');
console.log(compare('lukeburns', 'lukeburns.github.io', 'base', 'head'))

function req() {
  var command = Array.prototype.shift.apply(arguments);
  var callback;

  if (typeof arguments[arguments.length-1] === 'function') {
    callback = Array.prototype.pop.apply(arguments);
  }

  var requestor = makeReq(commands[command]);
  var req = requestor.apply(null, arguments);

  if (typeof arguments[arguments.length-1] === 'object' && arguments[arguments.length-1].auth) {
    var ind = arguments.length-1;
    req.auth = arguments[ind].auth;
    delete arguments[ind].auth;
  }

  if (typeof callback === 'function') {
    request(req, callback);
  } else {
    return request(req);
  }
}

function makeReq(str) {
  var ind = str.indexOf(' '),
      method = str.substr(0, ind),
      turl = str.substr(ind+1, str.length),
      args, body;

      args = turl.split('/').filter(function(val) {
        return val.indexOf(':') !== -1;
      }).reduce(function (last, curr, i) {
        if (i===1) {
          last = last.split('...');
        }
        return last.concat(curr.split('...'));
      }).map(function(curr) {
        return curr.slice(1);
      })

  return function () {
    var url = turl;
    var options;

    for (var i = 0; i < args.length; i++) {
      var key = args[i],
          val = arguments[i];
      if (typeof val === 'string') {
        console.log(key)
        url = url.replace(':'+key, val);
      } else {
        console.error('Expecting string for', args[i] ,'argument. Instead got', typeof val, val);
      }
    }

    var argumentslength = arguments.length;
    var argslength = args.length;

    if (argumentslength > argslength) {
      options = arguments[argumentslength-1];
    } else if (argumentslength < argslength) {
      var missing = args.slice(argslength - argumentslength, argslength).join(', ');
      console.error('Missing arguments:', missing);
    }

    var req = {
      headers: {
        'User-Agent': 'request'
      },
      method: method,
      url: 'https://api.github.com'+url,
      json: true,
      withCredentials: false
    }

    if (typeof options === 'object') {
      if (method === 'GET') {
        req.url += '?'+qs.stringify(options);
      } else {
        req.headers['Content-Type'] = 'application/json';
        req.body = options;
      }
    }

    return req;
  }
}