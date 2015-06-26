var camel = require('camel-case');
var infl = require('i')(true);

module.exports = name;

function name (str) {
  var ind = str.indexOf(' '),
      method = str.substr(0, ind).toLowerCase(),
      turl = str.substr(ind+1, str.length),
      turls = turl.split('/').slice(1),
      args = turl.split('/').filter(function(val) {
         return val.indexOf(':') !== -1;
      }).map(function(val) {
         return val.substr(1);
      });

  var result = method;

  if (method === 'post') {
    result = "create";
  }

  var curr;
  var last;

  for (var i = 0; i < turls.length; i++) {

    if (turls[i] === 'user') {
      continue;
    } else if (turls[i] === 'memberships' && turls[i-1] === 'user') {
      continue;
    }

    curr = capitalize(camel(turls[i].replace(/\:/g, "")));
    if (turls[i].indexOf(':') === -1 && turls[i+1] && turls[i+1].indexOf(':') === 0) {
      last = infl.singularize(curr);
      result += infl.singularize(curr);
      i++;
    } else if (curr !== last) {
      result += curr;
    }
  };

  if (method === 'post') {
    result = infl.singularize(result);
  }

  return result;
}

function capitalize (data) {
    return data.charAt(0).toUpperCase() + data.slice(1);
}