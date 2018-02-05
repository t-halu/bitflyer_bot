var request = require('request');
var crypto = require('crypto');
var fs = require('fs');
var bitflyer_apikey = JSON.parse(fs.readFileSync('C:/bitflyer_apikey.json', 'utf8'))
//gitにあげたくないので秘密鍵はCドライブ直下においとく
const ApiKey = bitflyer_apikey.apikey;
const ApiSecret = bitflyer_apikey.apisecret;
const API_VERSION = '/V1';
const PRODUCT_CODE = 'FX_BTC_JPY';
const GET = 'GET';
const POST = 'POST';

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
  call(GET, '/getmarkets', '', function(err, response, body) {
    //console.log(JSON.parse(body)[1].product_code);
    if (callback) {
      callback(JSON.parse(body));
    }
  });

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
]
alias: 以下の呼出で product_code を指定するときに、代わりに使用できます。*/

function getBoard(callback) {

  call(GET, '/getboard?product_code=' + PRODUCT_CODE, '', function(err, response, body) {
    //console.log(JSON.parse(body).asks[0].price+':'+JSON.parse(body).asks[0].size);
    //売れる価格と量，配列値とともに増加
    //console.log(JSON.parse(body).mid_price);
    //最終取引価格
    //console.log(JSON.parse(body).bids[0].price+':'+JSON.parse(body).bids[0].size);
    //買える価格と量，配列値とともに減少
    if (callback) {
      callback(JSON.parse(body));
    }
  });
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

function getTicker(callback) {

  call(GET, '/getticker?product_code=' + PRODUCT_CODE, '', function(err, response, body) {
    //console.log(JSON.parse(body).ltp);
    if (callback) {
      callback(JSON.parse(body));
    }
  });
}
/*Tickerを取得
{
  "product_code": "BTC_JPY",
  "timestamp": "2015-07-08T02:50:59.97",
  "tick_id": 3579,
  "best_bid": 30000,
  "best_ask": 36640,
  "best_bid_size": 0.1,
  "best_ask_size": 5,
  "total_bid_depth": 15.13,
  "total_ask_depth": 20,
  "ltp": 31690,
  "volume": 16819.26,
  "volume_by_product": 6819.26
}
timestamp: 時刻は UTC（協定世界時）で表されます。
ltp: 最終取引価格
volume: 24 時間の取引量
*/

function getExecutions(callback) {

  call(GET, '/getexecutions?product_code=' + PRODUCT_CODE, '', function(err, response, body) {
    //console.log(JSON.parse(body)[0]);
    //新しい順に配列に格納される
    if (callback) {
      callback(JSON.parse(body));
    }
  });

}
/*約定履歴を取得
[
  {
    "id": 39287,
    "side": "BUY",
    "price": 31690,
    "size": 27.04,
    "exec_date": "2015-07-08T02:43:34.823",
    "buy_child_order_acceptance_id": "JRF20150707-200203-452209",
    "sell_child_order_acceptance_id": "JRF20150708-024334-060234"
  },
  {
    "id": 39286,
    "side": "SELL",
    "price": 33170,
    "size": 0.36,
    "exec_date": "2015-07-08T02:43:34.72",
    "buy_child_order_acceptance_id": "JRF20150708-010230-400876",
    "sell_child_order_acceptance_id": "JRF20150708-024334-197755"
  }
]
side: この約定を発生させた注文（テイカー）の売買種別です。 板寄せによって約定した場合等、空文字列になることがあります。

クエリパラメータ：
count: 結果の個数を指定します。省略した場合の値は 100 です。
before: このパラメータに指定した値より小さい id を持つデータを取得します。
after: このパラメータに指定した値より大きい id を持つデータを取得します。
*/

function getBoardstate(callback) {

  call(GET, '/getboardstate?product_code=' + PRODUCT_CODE, '', function(err, response, body) {
    //console.log(JSON.parse(body).health);
    if (callback) {
      callback(JSON.parse(body));
    }
  });

}
/*板の状態を取得
{
  "health": "NORMAL",
  "state": "RUNNING",
}

{
  "health": "NORMAL",
  "state": "MATURED",
  "data": {
    "special_quotation": 410897
  }
}
health: 取引所の稼動状態です。以下のいずれかの値をとります。
NORMAL: 取引所は稼動しています。
BUSY: 取引所に負荷がかかっている状態です。
VERY BUSY: 取引所の負荷が大きい状態です。
SUPER BUSY: 負荷が非常に大きい状態です。発注は失敗するか、遅れて処理される可能性があります。
NO ORDER: 発注が受付できない状態です。
STOP: 取引所は停止しています。発注は受付されません。
state: 板の状態です。以下の値をとります。
RUNNING: 通常稼働中
CLOSED: 取引停止中
STARTING: 再起動中
PREOPEN: 板寄せ中
CIRCUIT BREAK: サーキットブレイク発動中
AWAITING SQ: Lightning Futures の取引終了後 SQ（清算値）の確定前
MATURED: Lightning Futures の満期に到達
data: 板の状態について、付加情報を提供します。
special_quotation: Lightning Futures の SQ（清算値）
*/

function getHealth(callback) {

  call(GET, '/gethealth?product_code=' + PRODUCT_CODE, '', function(err, response, body) {
    //console.log(JSON.parse(body).status);
    if (callback) {
      callback(JSON.parse(body));
    }
  });
}
/*取引所の状態取得。boardstateより速い
{
  "status": "NORMAL"
}
*/

function getBalance(callback) {

  call(GET, '/me/getbalance', '', function(err, response, body) {
    //console.log(JSON.parse(body));
    if (callback) {
      callback(JSON.parse(body));
    }
  });
}
/*資産残高取得
[
  {
    "currency_code": "JPY",
    "amount": 1024078,
    "available": 508000
  },
  {
    "currency_code": "BTC",
    "amount": 10.24,
    "available": 4.12
  },
  {
    "currency_code": "ETH",
    "amount": 20.48,
    "available": 16.38
  }
]
*/

function getCollateral(callback) {

  call(GET, '/me/getcollateral', '', function(err, response, body) {
    console.log(JSON.parse(body));
    if (callback) {
      callback(JSON.parse(body));
    }
  });
}
/*証拠金残高取得
{
  "collateral": 100000,
  "open_position_pnl": -715,
  "require_collateral": 19857,
  "keep_rate": 5.000
}
collateral: 預け入れた証拠金の評価額（円）です。
open_position_pnl: 建玉の評価損益（円）です。
require_collateral: 現在の必要証拠金（円）です。
keep_rate: 現在の証拠金維持率です。
*/

function getAddresses(callback) {

  call(GET, '/me/getaddresses', '', function(err, response, body) {
    //console.log(JSON.parse(body));
    if (callback) {
      callback(JSON.parse(body));
    }
  });
}
/*預入用アドレス取得
[
  {
    "type": "NORMAL",
    "currency_code": "BTC",
    "address": "3AYrDq8zhF82NJ2ZaLwBMPmaNziaKPaxa7"
  },
  {
    "type": "NORMAL",
    "currency_code": "ETH",
    "address": "0x7fbB2CC24a3C0cd3789a44e9073381Ca6470853f"
  }
]
type: 通常の預入用アドレスは "NORMAL" となります。
currency_code: ビットコイン預入用アドレスは "BTC", イーサ預入用アドレスの場合は "ETH"
*/

/*getMarkets();
getBoard();
getTicker();
getExecutions();
getBoardstate();
getHealth();
getBalance();
getCollateral();
getAddresses();*/


//即時関数でなんかしたいとき
/*(function() {
  var params = [];
  getHealth(function(body) {

    params['health'] = body.status;
    getBoard(function(body) {
      params['mid_price'] = body.mid_price;
      console.log(params);
    });
  });
}())
*/
