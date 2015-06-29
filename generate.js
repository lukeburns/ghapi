var qs = require('querystring')

module.exports = generate;

// Expect command in form of 'GET /repos/:owner/:repo/compare/:base...:head'
function generate (command) {
  var parts = command.split(' '), // split into ['GET', '/repos/:owner/:repo/compare/:base...:head']
      method = parts[0],
      turl = parts[1];

  // Get command arguments: (map '/repos/:owner/:repo/compare/:base...:head' to ['owner', 'repo', 'base', 'head'])
  var args = turl
  .split(':')
  .map(function (arg) {
    return arg.replace(/\/.*|\..*/, '');
  })
  .filter(function (arg) {
    return arg;
  })

  // Return request generator
  return function () {

    // Begin constructing request
    var req = {
      headers: { 'User-Agent': 'ghapi' },
      method: method,
      json: true,
      withCredentials: false
    };

    // Match up arguments
    var count = arguments.length; // number of arguments passed
    var expected = args.length; // expected number of arguments
    var url = turl;

    for (var i = 0; i < expected; i++) {
      var key = args[i],
          val = arguments[i];
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        url = url.replace(':'+key, val);
      } else {
        console.error('Expecting string for', args[i] ,'argument. Instead got', typeof val, val);
      }
    }

    // handle parameters
    var parameters;
    if (count > expected) {
      parameters = arguments[count-1];
      if (parameters.auth) {
        req.auth = parameters.auth;
        delete parameters.auth;
      }
    } else if (count < expected) {
      var missing = args.slice(expected - count, expected).join(', ');
      console.error('Missing arguments:', missing);
    }

    if (typeof parameters === 'object') {
      if (method === 'GET') {
        url += '?'+qs.stringify(parameters);
      } else {
        req.headers['Content-Type'] = 'application/json';
        req.body = parameters;
      }
    }

    req.url = 'https://api.github.com'+url;

    return req;
  }
}
