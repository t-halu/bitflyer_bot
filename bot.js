var request = require('request');
var crypto=require('crypto');
var fs = require('fs');
var bitflyer_apikey = JSON.parse(fs.readFileSync('C:/bitflyer_apikey.json', 'utf8'))
//gitにあげたくないので秘密鍵はCドライブ直下においとく
const ApiKey = bitflyer_apikey.apikey;
const ApiSecret = bitflyer_apikey.apisecret;
const API_VERSION = '/V1';
var timestamp = Date.now().toString();
var method = 'GET';
var path = '/me/getaddresses';
var text = timestamp + method + API_VERSION + path;
var sign = crypto.createHmac('sha256', ApiSecret).update(text).digest('hex');

var options = {
  url: 'https://api.bitflyer.jp' + API_VERSION + path,
  method: method,
  headers: {
    'ACCESS-KEY': ApiKey,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-SIGN': sign,
    'Content-Type': 'application/json'
  }
}


request(options, function(err, response, body) {
  console.log(body);
});
