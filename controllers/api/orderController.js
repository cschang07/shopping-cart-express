const db = require('../../models')
const Order = db.Order

let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: 'items' }).then(orders => {
      return res.json({ orders })
    })
  },
}

module.exports = orderController 