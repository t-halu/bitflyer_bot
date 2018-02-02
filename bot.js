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
/*マーケットの一覧を呼び出し
[
  { "product_code": "BTC_JPY" },
  { "product_code": "FX_BTC_JPY" },
  { "product_code": "ETH_BTC" },
  {
    "product_code": "BTCJPY28APR2017",
    "alias": "BTCJPY_MAT1WK"
  },
  {
    "product_code": "BTCJPY05MAY2017",
    "alias": "BTCJPY_MAT2WK"
  }
]*/
function getBoard(callback) {
  var mid_price;
  call('GET', '/getboard', '', function(err, response, body) {
    //console.log(body);
    mid_price=JSON.parse(body).mid_price;
    //console.log(JSON.parse(body).mid_price);
  });
  if (callback) {
    callback();
  }
}
/*板情報を呼び出し
{
  "mid_price": 33320,
  "bids": [
    {
      "price": 30000,
      "size": 0.1
    },
    {
      "price": 25570,
      "size": 3
    }
  ],
  "asks": [
    {
      "price": 36640,
      "size": 5
    },
    {
      "price": 36700,
      "size": 1.2
    }
  ]
}*/

/*getMarkets(function() {
});*/

getBoard(function(mid_price) {
  console.log(mid_price);
});
