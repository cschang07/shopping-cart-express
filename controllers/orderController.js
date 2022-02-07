const db = require('../models')
const Cart = db.Cart
const Order = db.Order
const OrderItem = db.OrderItem
const Product = db.Product
// for GET /order/:id/payment
const ngrok = require('ngrok')
const crypto = require("crypto")
const nodemailer = require('nodemailer')
const URL = 'https://92f1-2401-e180-88f0-5313-c596-573-1dd5-8db1.ngrok.io'
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.HASHKEY
const HashIV = process.env.HASHIV
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"
const ReturnURL = URL + "/newebpay/callback?from=ReturnURL"
const NotifyURL = URL + "/newebpay/callback?from=NotifyURL"
const ClientBackURL = URL + "/orders"

function genDataChain(TradeInfo) {
  let results = [];
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`);
  }
  return results.join("&");
}

function create_mpg_aes_encrypt(TradeInfo) {
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
  return enc + encrypt.final("hex");
}

function create_mpg_sha_encrypt(TradeInfo) {

  let sha = crypto.createHash("sha256");
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  return sha.update(plainText).digest("hex").toUpperCase();
}

function getTradeInfo(Amt, Desc, email) {

  console.log('===== getTradeInfo =====')
  console.log(Amt, Desc, email)
  console.log('==========')

  data = {
    'MerchantID': MerchantID, // 商店代號
    'RespondType': 'JSON', // 回傳格式
    'TimeStamp': Date.now(), // 時間戳記
    'Version': 2.0, // 串接程式版本
    'MerchantOrderNo': Date.now(), // 商店訂單編號
    'LoginType': 0, // 智付通會員
    'OrderComment': 'OrderComment', // 商店備註
    'Amt': Amt, // 訂單金額
    'ItemDesc': Desc, // 產品名稱
    'Email': email, // 付款人電子信箱
    'ReturnURL': ReturnURL, // 支付完成返回商店網址
    'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
    'ClientBackURL': ClientBackURL, // 支付取消返回商店網址
  }

  console.log('===== getTradeInfo: data =====')
  console.log(data)


  mpg_aes_encrypt = create_mpg_aes_encrypt(data)
  mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

  console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
  console.log(mpg_aes_encrypt)
  console.log(mpg_sha_encrypt)

  tradeInfo = {
    'MerchantID': MerchantID, // 商店代號
    'TradeInfo': mpg_aes_encrypt, // 加密後參數
    'TradeSha': mpg_sha_encrypt,
    'Version': 2.0, // 串接程式版本
    'PayGateWay': PayGateWay,
    'MerchantOrderNo': data.MerchantOrderNo,
  }

  console.log('===== getTradeInfo: tradeInfo =====')
  console.log(tradeInfo)

  return tradeInfo
}

let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ raw: true, nest: true, include: [{ model: Product, as: "items" }] }).then(orders => {
      console.log(orders)
      return res.render('orders', {
        orders
      })
    })
  },
  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
      }).then(order => {
        let results = [];
        for (let i = 0; i < cart.items.length; i++) {
          console.log(order.id, cart.items[i].id)
          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: cart.items[i].id,
              price: cart.items[i].price,
              quantity: cart.items[i].CartItem.quantity,
            })
          );
        }

        return Promise.all(results).then(() =>
          res.redirect('/orders')
        );

      })
    })
  },
  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      }).then(order => {
        return res.redirect('back')
      })
    })
  },
  getPayment: (req, res) => {
    console.log('===== getPayment =====')
    console.log(req.params.id)
    console.log('==========')

    return Order.findByPk(req.params.id).then(order => {
      console.log(req.body) //
      const tradeInfo = getTradeInfo(order.amount, '產品名稱', 'manutdsfan@gmail.com')
      order.update({
        ...req.body,
        serial_number: tradeInfo.MerchantOrderNo,
      })
      .then(order => {
        res.render('payment', { order, tradeInfo })
      })
    })
  },
  newebpayCallback: (req, res) => {
    console.log('===== newebpayCallback =====')
    console.log(req.method)
    console.log(req.query)
    console.log(req.body)
    console.log('==========')

    console.log('===== newebpayCallback: TradeInfo =====')
    console.log(req.body.TradeInfo)


    const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

    console.log('===== newebpayCallback: create_mpg_aes_decrypt、data =====')
    console.log(data)

    return Order.findAll({ where: { serial_number: data['Result']['MerchantOrderNo'] } }).then(orders => {
      orders[0].update({
        ...req.body,
        payment_status: 1,
      }).then(order => {
        return res.redirect('/orders')
      })
    })
  }
}

module.exports = orderController 