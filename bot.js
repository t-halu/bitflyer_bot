var request = require('request');
var crypto = require('crypto');
var fs = require('fs');
var bitflyer_apikey = JSON.parse(fs.readFileSync('C:/bitflyer_apikey.json', 'utf8'))
//gitにあげたくないので秘密鍵はCドライブ直下においとく
const ApiKey = bitflyer_apikey.apikey;
const ApiSecret = bitflyer_apikey.apisecret;
const API_VERSION = '/V1';

function call(method, path, body, callback) {
  var timestamp = Date.now().toString();
  var text = timestamp + method + API_VERSION + path + body;
  var sign = crypto.createHmac('sha256', ApiSecret).update(text).digest('hex');
  var url = 'https://api.bitflyer.jp' + API_VERSION + path;
  var options = {
    url: url,
    method: method,
    body: body,
    headers: {
      'ACCESS-KEY': ApiKey,
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-SIGN': sign,
      'Content-Type': 'application/json'
    }
  };
  request(options, callback);
}
//汎用的なAPI呼び出し関数

function getMarkets(callback) {
  call('GET', '/getmarkets', '', function(err, response, body) {
    console.log(body);
  });
  if (callback) {
    callback();
  }
}
//マーケットの一覧を呼び出し

getMarkets(function() {
  console.log('完了')
});
