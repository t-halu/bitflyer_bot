var request = require('request');
const API_VERSION='/V1';
var path = '/getmarkets';
var url = 'https://api.bitflyer.jp' + API_VERSION + path;
request(url, function(err, response, body) {
  console.log(response);
  console.log(body);
});
