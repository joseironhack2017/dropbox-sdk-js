'use strict';

// Standalone example to demonstrate codeflow.
// Start the server, hit localhost:3000 on the browser, and click through.
// On the server logs, you should have the auth code, as well as the token
// from exchanging it. This exchange is invisible to the app user

var fetch = require('isomorphic-fetch');
const app = require('express')();
const hostname = 'localhost';
const port = 3000;
//const https = require('https');

const config = {
  fetch: fetch,
  clientId: [clientId]
};

const Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox(config);

const redirectUri = `http://${hostname}:${port}/auth`;
const authUrl = dbx.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', true);

app.get('/', (req, res) => {
  res.writeHead(302, { 'Location': authUrl });
  res.end();
});


app.get('/auth', (req, res) => {
  let code = req.query.code;
  console.log('code:' + code);
  var options = Object.assign({
    code,
    redirectUri
  }, config);


  dbx.getAccessTokenFromCode(redirectUri, code)
    .then(function(token) {
        console.log('Token Result:' + JSON.stringify(token));
        dbx.setRefreshToken(token.refreshToken);
        dbx.usersGetCurrentAccount()
          .then(function(response) {
            console.log('response', response)
          })
          .catch(function(error) {
            console.error(error);
          });
    })
    .catch(function(error) {
        console.log(error);
    });
});

app.listen(port);
