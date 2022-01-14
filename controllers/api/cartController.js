const db = require('../../models')
const Cart = db.Cart
const CartItem = db.CartItem
// const PAGE_LIMIT = 10;
// const PAGE_OFFSET = 0;

const cartController = {
  getCart: (req, res) => {
    return Cart.findOne({ include: 'items' }).then(cart => {
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.json({ cart, totalPrice })
    })
  }, //will be rewrite with express-session middleware soon
  
}

module.exports = cartController