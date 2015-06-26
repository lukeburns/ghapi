var request = require('request');
var qs = require('querystring');
var commands = require('./commands');

module.exports = req;

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
      args = turl.split('/').filter(function(val) {
         return val.indexOf(':') !== -1;
      }).map(function(val) {
         return val.substr(1);
      }),
      body;

  return function () {
    var url = turl;
    var options;

    for (var i = 0; i < args.length; i++) {
      var key = args[i],
          val = arguments[i];
      if (typeof val === 'string') {
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
      json: true
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
