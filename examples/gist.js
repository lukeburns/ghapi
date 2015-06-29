var req = req || require('../');

var input = {
  files: {
    api: {
      content: 'hello!'
    }
  }
}

req('createGist', input, function (err, res, body) {
  if(!err) {
    req('getGist', body.id, function (err, res, body) {
      if (typeof window !== 'undefined') {
        document.body.appendChild(document.createTextNode("Created new gist: "+body.files.api.content));
      }
      console.log(body);
    });
  }
});
