var req = req || require('../');

var input = {
  files: {
    api: {
      content: 'hello!'
    }
  }
}

req('createGist', input, function (err, data, res) {
  if(!err) {
    req('getGist', res.id, function (err, data, res) {
      document.body.appendChild(document.createTextNode("Created new gist: "+res.files.api.content));
      console.log(res);
    });
  }
});