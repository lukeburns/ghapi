# github api (ghapi)

A github api for node and the browser.

## Usage

```
npm install ghapi
```

```javascript
var api = require('ghapi')
```

```javascript
api(command, arg_1, ..., arg_n [, parameters, callback])
```

See `commands.js` for a list of all the commands. The file is compiled by scraping all the commands form the [Github API documentation](https://developer.github.com/v3/). Consult the Github documentation for parameters associated with each api call. For commands requiring authentication, append an `auth` object to parameters.


### Create a new gist

```
POST /gists
```

```javascript
api('createGist', parameters)
```

```javascript
var files = { 
  'api.txt': { 
    content: 'hello!' 
  }
}
var basicAuth = { 
  user: 'user', 
  pass: 'pass' 
}
api('createGist', { files: files, auth: basicAuth }).pipe(process.stdout);
```

### Fork a gist

```
POST /gists/:id/forks
```

```javascript
api('createGistFork', id, parameters);
```

```javascript
var bearerAuth = { bearer: 'access token' } // github access token
api('createGistFork', '1',  { auth: bearerAuth }, function (err, res, body) {
  console.log(body);
});
```

## Todo

- Add tests and documentation
