var api = ghapi || require('../')

api('getRepoCompare', 'lukeburns', 'strategy', 'lukeburns:master', 'jsapriel:master', function (err, res, body) {
  console.log(err, body);
});
