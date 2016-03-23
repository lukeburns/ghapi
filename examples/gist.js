var api = ghapi || require('../');

var input = {
  files: {
    api: {
      content: 'hello!'
    }
  }
}

api('createGist', input, function (err, res, body) {
  if (typeof window !== 'undefined') {
    console.log(err)
    document.body.appendChild(document.createTextNode("Error: "+err+". "));
    document.body.appendChild(document.createTextNode("Created new gist: "+body.html_url+". "));
  }
});
