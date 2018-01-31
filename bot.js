var request = require('request');
var path = '/v1/getmarkets';
var query = '';
var url = 'https://api.bitflyer.jp' + path + query;
request(url, function(err, response, payload) {
  console.log(payload);
});
