var api = ghapi || require('../')

api('getRepoForks', 'michael', 'github', { per_page: 1 }, function (err, res, body) {
  console.log(Object.keys(body[0]).filter(function (key) {
    return key.indexOf('url') === -1;
  }))
});
