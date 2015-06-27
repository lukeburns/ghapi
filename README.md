# github api (ghapi)

A small github api for node and the browser.

## Get started

```
npm install ghapi
```

```javascript
var api = require('ghapi');
api(command, arg_1, ..., arg_n [, options, callback]);
```

See `commands.js` for a list of all the commands. The file is compiled by scraping all the commands form the [Github API documentation](https://developer.github.com/v3/). Consult the Github documentation for parameters associated with each api call.

## Examples

```javascript
var api = require('ghapi');
```

```POST /gists```

```javascript
api('createGist', { files: { 'api.txt': { content: 'hello!' } }).pipe(process.stdout);
```

```POST /gists/:id/forks```

```javascript
api('createGistFork', '1', { auth: { user: 'user', pass: 'pass' } }, function (err, res, body) {
  console.log(body);
});
```

## Todo

- Add tests and documentation
