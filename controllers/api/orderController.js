const db = require('../../models')
const Cart = db.Cart
const Order = db.Order
const OrderItem = db.OrderItem


let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: 'items' }).then(orders => {
      return res.json({ orders })
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
        return Promise.all(results)
          .then(() =>
            res.json({ status: 'success', message: ' Order posted successfully.' })
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
}

module.exports = orderController 