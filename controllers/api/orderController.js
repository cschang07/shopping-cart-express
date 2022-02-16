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
    Order.findAll({ where: { UserId: req.user.id } })
      .then(orders => {
        return res.json({ orders })
      })
  },
  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {
      console.log(cart)
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
        UserId: req.user.id // <-----here
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
        return Promise.all(results)
          .then(() =>
            res.json({ status: 'success', message: '訂單新增成功' })
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
    console.log('===== getPayment =====')
    console.log(req.params.id)
    console.log('==========')

    return Order.findByPk(req.params.id, {}).then(order => {
      return res.json({ order })
    })
  },
  newebpayCallback: (req, res) => {
    console.log('===== newebpayCallback =====')
    console.log(req.body)
    console.log('==========')

    return res.json({ status: 'success', message: '' })
  }
}

module.exports = orderController 