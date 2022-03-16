const db = require('../../models')
const Cart = db.Cart
const Order = db.Order
const OrderItem = db.OrderItem
const Product = db.Product


let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: { model: Product, as: 'items' } }).then(orders => {
      return res.json({ orders })
    })
  }, //for admin
  getOrder: (req, res) => {
    Order.findAll({ where: { UserId: req.user.id }, include:{ model: Product, as: 'items' } })
      .then(orders => {
        return res.json({ orders })
      })
  },
  postOrder: (req, res) => {
    const tradeInfo = helpers.getTradeInfo(amount, 'jeans', email)
    return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {
      console.log(cart)
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
        UserId: req.user.id,
        sn: String(tradeInfo.MerchantOrderNo)
      }).then(order => {
        let results = [];
        console.log(cart.items)
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
        return Promise.all(results)
          .then(() =>
            res.json({ status: 'success', message: '訂單新增成功' , tradeInfo: tradeInfo})
          );
      })
    })
  },
  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      console.log(req.body)
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      }).then(order => {
        return res.json({ status: 'success', message: ' Order cancelled successfully.' })
      })
    })
  },
  getPayment: (req, res) => {
    const MerchantOrderNo = req.params.id
    return Order.findAll({
      where: {
        sn: MerchantOrderNo
      },
      include: [OrderItem]
    })
      .then((order) => {
        const data = order[0]
        return res.json({ data })
      })
  },
  spgatewayCallback: (req, res) => {
    console.log('===== spgatewayCallback =====')
    console.log(req.method)
    console.log(req.query)
    console.log(req.body)
    console.log('==========')

    const data = JSON.parse(helpers.create_mpg_aes_decrypt(req.body.TradeInfo))
    console.log('===== spgatewayCallback: create_mpg_aes_decrypt、data =====')
    console.log(data)
    return Order.findAll({
      where: {
        sn: data.Result.MerchantOrderNo
      }
    })
      .then((orders) => {
        orders[0].update({
          payment_status: 1
        })
          .then(order => {
            CartItem.destroy({
              where: { UserId: order.UserId }
            })
              .then(() => {
                return res.redirect(`${process.env.BASE_URL}/#/checkout/success?sn=${data.Result.MerchantOrderNo}`)
              })
          })
      })
  }
}

module.exports = orderController 