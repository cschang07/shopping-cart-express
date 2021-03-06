const db = require('../../models')
const Cart = db.Cart
const CartItem = db.CartItem
const User = db.User
// const PAGE_LIMIT = 10;
// const PAGE_OFFSET = 0;

const cartController = {
  getCart: (req, res) => {
    return Cart.findByPk(req.user.id, { include: 'items' }).then(cart => {
      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.json({ cart, totalPrice })
    })
  },
  postCart: (req, res) => {
    return Cart.findOrCreate({
      //check if a cart already exists in req.session. Set it to 0 if it doesn't.
      where: {
        id: req.user.id || 0, //請前端夥伴做一個form contains "idToFindCart" which is user's id
      },
    }).then(cart => {
      //check if the product we want to add is already in the cart, create one if it isn't. 
      return CartItem.findOrCreate({
        where: {
          CartId: cart[0].dataValues.id,
          ProductId: req.body.productId
        },
        default: {
          CartId: cart[0].dataValues.id,
          ProductId: req.body.productId,
        }
      }).then(cartItem => {
        //Increase quantity by 1
        cartItem[0].update({ quantity: (cartItem[0].dataValues.quantity || 0) + 1 })
      })
        .then((cartItem) => {
          return res.json({ status: 'success', message: '商品已新增' })
        })
      .catch(err => console.log(err))
    });
  },
  addCartItem: (req, res) => {
    CartItem.findByPk(req.body.cartItemId).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1,
      })
        .then((cartItem) => {
          return res.json({ status: 'success', message: 'quantity of product + 1 successfully.' })
        })
    })
  },
  subCartItem: (req, res) => {
    CartItem.findByPk(req.body.cartItemId).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1,
      })
        .then((cartItem) => {
          return res.json({ status: 'success', message: ' quantity of product - 1 successfully.' })
        })
    })
  },
  deleteCartItem: (req, res) => {
    CartItem.findByPk(req.body.cartItemId).then(cartItem => {
      cartItem.destroy()
        .then((cartItem) => {
          return res.json({ status: 'success', message: ' product deleted from cart successfully.' })
        })
    })
  }
}

module.exports = cartController