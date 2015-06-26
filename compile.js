var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');
var name = require('./name');

var source = 'https://developer.github.com';
var filter = ['octo', 'skunk', 'https']; // filter commands containing these keywords

scrape(function (cmds) {
  var commands = {};
  var duplicates = hasDuplicates(cmds);
  cmds = cmds.sort();

  for (var i = 0; i < cmds.length; i++) {
    commands[name(cmds[i])] = cmds[i];
  };

  fs.writeFile('commands.js', 'module.exports = ' + JSON.stringify(commands, null, 2), function (err, data) {
    console.log(require('./commands'))
    if (!err && !duplicates) {
      console.log('0 duplicates.')
      console.log('Successful compilation.');
    } else if (!err && duplicates) {
      console.error('There are duplicates, but commands.js was compiled. Remove duplicates manually.');
    } else {
      console.error(err)
    }
  });
})

function scrape (cb) {

  var cmd = [];
  var completed = 0;

  request(source+'/v3/', function (error, response, body) {
    var urls = [];
    if (!error) {
      var $ = cheerio.load(body);
      $('#js-sidebar li a[href^="/v3/"]').each(function(i, el) {
        urls.push(el.attribs.href);
      });
      for (var i = 0; i < urls.length; i++) {
        getCommands(urls[i], function (err, commands) {
          cmd = cmd.concat(commands);

          completed++;
          if (completed === urls.length) {
            cb(cmd);
          }
        });
      };
    } else {
      console.error("We’ve encountered an error: " + error);
    }
  });

}

function getCommands (url, cb) {
  request(source+url, function (error, response, body) {
    var commands = [];
    if (!error) {
      var $ = cheerio.load(body);
      $('pre code:contains("GET"), pre code:contains("POST"), pre code:contains("PATCH"), pre code:contains("PUT"), pre code:contains("DELETE")').not('.highlight').each(function(i, el) {
        var command = el.children[0].data.trim()
        if (filtered(command)) {
          commands.push(command)
        }
      });
    }
    cb(error, commands);
  });
}

function filtered(command) {
  for (var i = filter.length - 1; i >= 0; i--) {
    if (command.indexOf(filter[i]) !== -1) {
      return false
    }
  };
  return true;
}

function hasDuplicates(array) {
    return (new Set(array)).size === array.length;
}