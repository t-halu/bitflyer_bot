var request = require('request');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('C:/bitflyer_apikey.json', 'utf8'))
//gitにあげたくないので秘密鍵はCドライブ直下においとく
const ApiKey = config.apikey;
const ApiSecret = config.apisecret;
const API_VERSION='/V1';

console.log(ApiKey);

/*var path = '/getmarkets';
var url = 'https://api.bitflyer.jp' + API_VERSION + path;
request(url, function(err, response, body) {
  console.log(response);
  console.log(body);
});
*/
