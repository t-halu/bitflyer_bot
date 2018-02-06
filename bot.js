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
const MARKET = 'MARKET';
const LIMIT = 'LIMIT';
const STOP = 'STOP';
const STOP_LIMIT = 'STOP_LIMIT';
const TRAIL = 'TRAIL';
const BUY = 'BUY'
const SELL = 'SELL'

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
  call(GET, '/getmarkets', '', function(err, response, payload) {
    //console.log(JSON.parse(payload)[1].product_code);
    if (callback) {
      callback(JSON.parse(payload));
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

  call(GET, '/getboard?product_code=' + PRODUCT_CODE, '', function(err, response, payload) {
    //console.log(JSON.parse(payload).asks[0].price+':'+JSON.parse(payload).asks[0].size);
    //売れる価格と量，配列値とともに増加
    //console.log(JSON.parse(payload).mid_price);
    //最終取引価格
    //console.log(JSON.parse(payload).bids[0].price+':'+JSON.parse(payload).bids[0].size);
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

  call(GET, '/getticker?product_code=' + PRODUCT_CODE, '', function(err, response, payload) {
    //console.log(JSON.parse(payload).ltp);
    if (callback) {
      callback(JSON.parse(payload));
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

  call(GET, '/getexecutions?product_code=' + PRODUCT_CODE, '', function(err, response, payload) {
    //console.log(JSON.parse(payload)[0]);
    //新しい順に配列に格納される
    if (callback) {
      callback(JSON.parse(payload));
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

  call(GET, '/getboardstate?product_code=' + PRODUCT_CODE, '', function(err, response, payload) {
    //console.log(JSON.parse(payload).health);
    if (callback) {
      callback(JSON.parse(payload));
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

  call(GET, '/gethealth?product_code=' + PRODUCT_CODE, '', function(err, response, payload) {
    //console.log(JSON.parse(payload).status);
    if (callback) {
      callback(JSON.parse(payload));
    }
  });
}
/*取引所の状態取得。boardstateより速い
{
  "status": "NORMAL"
}
*/

function getBalance(callback) {

  call(GET, '/me/getbalance', '', function(err, response, payload) {
    //console.log(JSON.parse(payload));
    if (callback) {
      callback(JSON.parse(payload));
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

  call(GET, '/me/getcollateral', '', function(err, response, payload) {
    //console.log(JSON.parse(payload));
    if (callback) {
      callback(JSON.parse(payload));
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

  call(GET, '/me/getaddresses', '', function(err, response, payload) {
    //console.log(JSON.parse(payload));
    if (callback) {
      callback(JSON.parse(payload));
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

function sendChildOrder(type, side, price, size, callback) {
  var body = JSON.stringify({
    product_code: PRODUCT_CODE,
    child_order_type: type,
    side: side,
    price: price,
    size: size,
  });
  getHealth(function(payload) {
    if (payload.status == 'NORMAL') {
      call(POST, '/me/sendchildorder', body, function(err, response, payload) {
        //console.log(JSON.parse(payload));
        if (callback) {
          callback(JSON.parse(payload));
        }
      });
    };
  });
}

/*子注文をする（成行と指値のみ）
bodyパラメータ

product_code: 必須。注文するプロダクトです。マーケットの一覧で取得できる product_code または alias のいずれかを指定してください。
child_order_type: 必須。指値注文の場合は "LIMIT", 成行注文の場合は "MARKET" を指定します。
side: 必須。買い注文の場合は "BUY", 売り注文の場合は "SELL" を指定します。
price: 価格を指定します。child_order_type に "LIMIT" を指定した場合は必須です。
size: 必須。注文数量を指定します。
minute_to_expire: 期限切れまでの時間を分で指定します。省略した場合の値は 43200 (30 日間) です。
time_in_force: 執行数量条件 を "GTC", "IOC", "FOK" のいずれかで指定します。省略した場合の値は "GTC" です。
レスポンス
{
    "child_order_acceptance_id": "JRF20150707-050237-639234"
}
child_order_acceptance_id: API の受付 ID です。注文を指定する際に、child_order_id の代わりに指定できます。
 注文をキャンセルする, 約定の一覧を取得 の項もご確認ください。
*/

function sendParentOrder(order_method, order_index, callback) {
  var body = JSON.stringify({
    order_method: order_method,
    parameters: order_index
  });
  getHealth(function(payload) {
    if (payload.status == 'NORMAL') {
      call(POST, '/me/sendparentorder', body, function(err, response, payload) {
        //console.log(JSON.parse(payload));
        if (callback) {
          callback(JSON.parse(payload));
        };
      });
    };
  });
}
/*親注文をする
bodyパラメータ
order_method: 注文方法です。以下の値のいずれかを指定してください。省略した場合の値は "SIMPLE" です。
"SIMPLE": 1 つの注文を出す特殊注文です。
"IFD": IFD 注文を行います。一度に 2 つの注文を出し、最初の注文が約定したら 2 つめの注文が自動的に発注される注文方法です。
"OCO": OCO 注文を行います。2 つの注文を同時に出し、一方の注文が成立した際にもう一方の注文が自動的にキャンセルされる注文方法です。
"IFDOCO": IFD-OCO 注文を行います。最初の注文が約定した後に自動的に OCO 注文が発注される注文方法です。
minute_to_expire: 期限切れまでの時間を分で指定します。省略した場合の値は 43200 (30 日間) です。
time_in_force: 執行数量条件 を "GTC", "IOC", "FOK" のいずれかで指定します。省略した場合の値は "GTC" です。
parameters: 必須。発注する注文のパラメータを指定する配列です。 指定した order_method の値によって、必要な配列の長さが異なります。
"SIMPLE" の場合、1 つのパラメータを指定します。
"IFD" の場合、2 つ指定します。 1 つめのパラメータが、最初に発注される注文のパラメータです。 2 つめは、最初の注文の約定後に発注される注文のパラメータになります。
"OCO" の場合、2 つ指定します。 パラメータをもとに 2 つの注文が同時に出されます。
"IFDOCO" の場合、3 つ指定します。 1 つめのパラメータが、最初に発注される注文のパラメータです。 その注文が約定した後、2 つめと 3 つめのパラメータをもとに OCO 注文が出されます。
parameters には以下のキーと値を持つオブジェクトの配列を指定します。

product_code: 必須。注文するプロダクトです。マーケットの一覧で取得できる product_code または alias のいずれかを指定してください。
condition_type: 必須。注文の執行条件です。以下の値のうちいずれかを指定してください。
"LIMIT": 指値注文。
"MARKET" 成行注文。
"STOP": ストップ注文。
"STOP_LIMIT": ストップ・リミット注文。
"TRAIL": トレーリング・ストップ注文。
side: 必須。買い注文の場合は "BUY", 売り注文の場合は "SELL" を指定します。
size: 必須。注文数量を指定します。
price: 価格を指定します。 condition_type に "LIMIT" または "STOP_LIMIT" を選んだ場合は必須です。
trigger_price: ストップ注文のトリガー価格を指定します。 condition_type に "STOP" または "STOP_LIMIT" を選んだ場合は必須です。
offset: トレーリング・ストップ注文のトレール幅を、正の整数で指定します。 condition_type に "TRAIL" を選んだ場合は必須です。

レスポンス
{
  "parent_order_acceptance_id": "JRF20150707-050237-639234"
}
*/

function CancelAllChildOrders(callback) {
  body = JSON.stringify({
    product_code: PRODUCT_CODE
  });
  call(POST, '/me/cancelallchildorders', body, function(err, response, payload) {
    //console.log(JSON.parse(payload));
    if (callback) {
      callback(JSON.parse(payload));
    }
  });
}
//全注文キャンセル

function getCollateralHistory(callback) {

  call(GET, '/me/getcollateralhistory', '', function(err, response, payload) {
    console.log(JSON.parse(payload));
    if (callback) {
      callback(JSON.parse(payload));
    }
  });
}
/*証拠金の変動履歴を取得
クエリパラメータ：
count: 結果の個数を指定します。省略した場合の値は 100 です。
before: このパラメータに指定した値より小さい id を持つデータを取得します。
after: このパラメータに指定した値より大きい id を持つデータを取得します。
レスポンス
[
  {
    "id": 4995,
    "currency_code": "JPY",
    "change": -6,
    "amount": -6,
    "reason_code": "CLEARING_COLL",
    "date": "2017-05-18T02:37:41.327"
  },
  {
    "id": 4994,
    "currency_code": "JPY",
    "change": 2083698,
    "amount": 0,
    "reason_code": "EXCHANGE_COLL",
    "date": "2017-04-28T03:05:07.493"
  },
  {
    "id": 4993,
    "currency_code": "BTC",
    "change": -14.69001618,
    "amount": 34.97163164,
    "reason_code": "EXCHANGE_COLL",
    "date": "2017-04-28T03:05:07.493"
  }
]
change: 証拠金の変動額です。
amount: 変動後の証拠金の残高です。
*/

function MarketOrder(side, size, callback) {
  sendChildOrder(MARKET, side, null, size, callback);
}
//成行注文

function LimitOrder(side, price, size, callback) {
  sendChildOrder(LIMIT, side, price, size, callback);
}
//指値注文

function StopOrder(side, trigger_price, size, callback) {
  sendParentOrder('SIMPLE', [{
    product_code: PRODUCT_CODE,
    condition_type: STOP,
    side: side,
    size: size,
    trigger_price: trigger_price
  }], callback);
}
//STOP注文

function StopLimitOrder(side, trigger_price, price, size, callback) {
  sendParentOrder('SIMPLE', [{
    product_code: PRODUCT_CODE,
    condition_type: STOP_LIMIT,
    side: side,
    size: size,
    price: price,
    trigger_price: trigger_price
  }], callback);
}
//STOPLIMIT注文

function TrailOrder(side, size, offset, callback) {
  sendParentOrder('SIMPLE', [{
    product_code: PRODUCT_CODE,
    condition_type: TRAIL,
    side: side,
    size: size,
    offset: offset
  }], callback);
}
//TRAIL注文

function IfdOrder(order1, order2, callback) {
  var order_index = [];
  order_index[0] = order1;
  order_index[1] = order2;
  sendParentOrder('IFD', order_index, callback);
}
//IFD注文

function OcoOrder(order1, order2, callback) {
  var order_index = [];
  order_index[0] = order1;
  order_index[1] = order2;
  sendParentOrder('OCO', order_index, callback);
}
//OCO注文

function IfdOcoOrder(order1, order2, order3, callback) {
  var order_index = [];
  order_index[0] = order1;
  order_index[1] = order2;
  order_index[2] = order3;
  sendParentOrder('IFDOCO', order_index, callback);
}
//IFDOCO注文

function MarketOrderParam(side, size) {
  return {
    product_code: PRODUCT_CODE,
    condition_type: MARKET,
    side: side,
    size: size
  }
}
//成行注文のbody作成

function LimitOrderParam(side, price, size) {
  return {
    product_code: PRODUCT_CODE,
    condition_type: LIMIT,
    side: side,
    size: size,
    price: price
  }
}
//指値注文のbody作成

function StopOrderParam(side, trigger_price, size) {
  return {
    product_code: PRODUCT_CODE,
    condition_type: STOP,
    side: side,
    size: size,
    trigger_price: trigger_price
  }
}
//STOP注文のbody作成

function StopLimitOrderParam(side, trigger_price, price, size) {
  return {
    product_code: PRODUCT_CODE,
    condition_type: STOP_LIMIT,
    side: side,
    size: size,
    trigger_price: trigger_price,
    price: price
  }
}
//StopLimit注文のbody作成

function TrailOrderParam(side, size, offset) {
  return {
    product_code: PRODUCT_CODE,
    condition_type: TRAIL,
    side: side,
    size: size,
    offset: offset
  }
}
//成行注文のbody作成

/*IfdOcoOrder(LimitOrderParam(SELL, 800000, 0.001), StopLimitOrderParam(BUY, 550000, 560000, 0.001), TrailOrderParam(SELL, 0.001, 300), function(payload) {
  console.log(payload.parent_order_acceptance_id);
});*/

MarketOrder(SELL,0.001);



//MarketOrder(SELL,0.001);
//LimitOrder(SELL, 790000, 0.001);
//StopLimitOrder(SELL, 500000,490000, 0.001);
/*getMarkets();
getBoard();
getTicker();
getExecutions();
getBoardstate();
getHealth();
getBalance();
getCollateral();
getAddresses();
sendChildOrder(LIMIT, BUY, 600000, 0.001, function(payload) {
  console.log(payload.child_order_acceptance_id);
});
sendParentOrder('IFDOCO', [{
  product_code: PRODUCT_CODE,
  condition_type: LIMIT,
  side: BUY,
  size: 0.002,
  price: 600000
}, {
  product_code: PRODUCT_CODE,
  condition_type: LIMIT,
  side: SELL,
  size: 0.001,
  price: 700000
}, {
  product_code: PRODUCT_CODE,
  condition_type: STOP,
  side: SELL,
  size: 0.001,
  trigger_price: 500000
}], function(payload) {
  console.log(payload.parent_order_acceptance_id);
});
CancelAllChildOrders();*/

//即時関数でなんかしたいとき
/*(function() {
  var params = [];
  getHealth(function(payload) {

    params['health'] = payload.status;
    getBoard(function(payload) {
      params['mid_price'] = payload.mid_price;
      console.log(params);
    });
  });
}())
*/
